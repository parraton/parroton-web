'use client';
/* eslint-disable react/jsx-no-literals */

import { CardContent, CardFooter } from '@UI/card';
import { Label } from '@UI/label';
import { Button } from '@UI/button';
import { ErrorMessage, Form, Field, useFormik, FormikProvider } from 'formik';
import { useDeposit } from '@hooks/use-deposit';
import { useTranslation } from '@i18n/client';
import { useLpBalance } from '@hooks/use-lp-balance';
import {
  cn,
  formatCurrency,
  formatLpAmount,
  formatNumber,
  formatPercentage,
  getAmountAsStringValidationSchema,
} from '@lib/utils';
import { toFormikValidate } from 'zod-formik-adapter';
import { z } from 'zod';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { Loader, OrLoader } from '@components/loader/loader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getVault } from '@core';
import { Address, fromNano, toNano } from '@ton/core';
import { useVaultData } from '@hooks/use-vault-data';
import useSWR from 'swr';
import { AssetAmountInput } from '@UI/asset-amount-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@UI/dialog';
import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';
import BigNumber from 'bignumber.js';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault: vaultAddress } = useParams(VaultPage);
  const { vault, error: vaultError } = useVaultData(vaultAddress);
  const { balance, error: balanceError } = useLpBalance(vaultAddress);
  const walletAddress = useTonAddress();

  const [inputAmount, setInputAmount] = useState<string>('');
  const setInputAmountDebounced = useDebouncedCallback(setInputAmount, 500);

  const getVaultContract = useCallback(
    ([, vaultAddress]: [string, string]) => getVault(Address.parse(vaultAddress)),
    [],
  );
  const { data: vaultContract } = useSWR(['vault-contract', vaultAddress], getVaultContract, {
    shouldRetryOnError: true,
    errorRetryInterval: 5000,
    suspense: false,
  });

  const amountValidationSchema = useMemo(
    () =>
      getAmountAsStringValidationSchema(
        {
          required: t('validation.required'),
          invalidFormat: t('validation.invalid_format'),
          min: (amount: string | number) => t('validation.min_deposit', { minDeposit: amount }),
          max: (amount: string | number) => t('validation.max_deposit', { maxDeposit: amount }),
        },
        {
          required: true,
          min: 0,
          max: balance ?? undefined,
        },
      ),
    [balance, t],
  );
  const validate = useMemo(
    () =>
      toFormikValidate(
        z.object({
          amount: amountValidationSchema,
        }),
      ),
    [amountValidationSchema],
  );

  const fetchSharesEquivalent = useCallback(
    async ([, inputAmount, vaultAddress]: [string, string, string]) => {
      if (amountValidationSchema.safeParse(inputAmount).success === false) {
        return '0';
      }

      const x = await (
        vaultContract ?? (await getVaultContract(['', vaultAddress]))
      ).getEstimatedSharesAmount(toNano(inputAmount));

      return fromNano(x);
    },
    [amountValidationSchema, getVaultContract, vaultContract],
  );
  const { data: estimatedShares, error: sharesError } = useSWR(
    ['deposit-estimated-shares', inputAmount, vaultAddress, balance],
    fetchSharesEquivalent,
    {
      refreshInterval: 10_000,
      shouldRetryOnError: true,
      errorRetryInterval: 1000,
      suspense: false,
    },
  );
  const balanceIsLoading = !balanceError && balance === undefined;
  const currencyIsLoading = !vaultError && !vault;
  const sharesLoading = !estimatedShares && !sharesError;

  return {
    balanceIsLoading,
    currencyIsLoading,
    dollarEquivalentIsLoading: balanceIsLoading || currencyIsLoading,
    apy: vault?.apy,
    balance,
    estimatedShares,
    sharesLoading,
    walletAddress,
    triggerUpdateSharesEquivalent: setInputAmountDebounced,
    validate,
    currency: vault?.lpMetadata.symbol,
    dollarEquivalent: multiplyIfPossible(vault?.lpPriceUsd, balance),
  };
};

export function DepositForm() {
  const { t, lng } = useTranslation({ ns: 'common' });
  const { t: formT } = useTranslation({ ns: 'form' });
  const { deposit } = useDeposit();
  const {
    balance,
    estimatedShares,
    sharesLoading,
    triggerUpdateSharesEquivalent,
    walletAddress,
    validate,
    currency,
    dollarEquivalent,
    balanceIsLoading,
    currencyIsLoading,
    dollarEquivalentIsLoading,
    apy,
  } = useFormData();
  const tonConnectModal = useTonConnectModal();
  const [confirmIsOpen, handleConfirmOpenChange] = useState(false);

  const onSubmit = useCallback(async () => {
    handleConfirmOpenChange(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      amount: balance ?? '0',
    },
    validate,
    onSubmit,
  });
  const { isSubmitting, isValid, values, setValues, resetForm } = formik;

  const handleDepositClick = useCallback(async () => {
    try {
      await deposit(values.amount.replace(',', '.'));
      // TODO: implement status tracking
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      resetForm();
    }
  }, [deposit, resetForm, values.amount]);

  useEffect(
    () => void triggerUpdateSharesEquivalent(values.amount.replace(',', '.')),
    [triggerUpdateSharesEquivalent, values.amount],
  );

  const handleMaxAmountClick = useCallback(() => {
    if (balance) {
      setValues((prevValues) => ({ ...prevValues, amount: balance }));
    }
  }, [balance, setValues]);

  const formattedEstimatedShares = useMemo(
    () => estimatedShares && formatLpAmount(estimatedShares, lng),
    [estimatedShares, lng],
  );

  const formattedExchangeRate = useMemo(() => {
    if (!estimatedShares || !Number(estimatedShares)) {
      return '~~~~';
    }

    const exchangeRate = new BigNumber(values.amount)
      .div(estimatedShares)
      .decimalPlaces(4, BigNumber.ROUND_FLOOR);

    return `1 PLP = ${formatNumber(exchangeRate.toString())} ${currency}`;
  }, [currency, estimatedShares, values.amount]);

  return (
    <FormikProvider value={formik}>
      <Form>
        <CardContent className='space-y-2'>
          <div className='space-y-1'>
            <Label className={'flex items-center gap-1'} htmlFor='amount'>
              {t('amount')}:{' '}
              {
                <OrLoader
                  animation={balanceIsLoading}
                  value={balance}
                  modifier={(x) => formatNumber(x, lng)}
                />
              }{' '}
              {<OrLoader animation={currencyIsLoading} value={currency} />} (
              <OrLoader
                animation={dollarEquivalentIsLoading}
                value={dollarEquivalent}
                modifier={(x) => formatCurrency(x, lng)}
              />
              )
            </Label>
            <Field
              name='amount'
              id='amount'
              type='text'
              as={AssetAmountInput}
              onMaxAmountClick={balance && handleMaxAmountClick}
            />
            <ErrorMessage
              className={cn('text-sm text-red-500', 'mt-1')}
              component='div'
              name='amount'
            />
          </div>
        </CardContent>
        <CardFooter>
          {walletAddress ? (
            <Dialog open={confirmIsOpen} onOpenChange={handleConfirmOpenChange}>
              <Button
                disabled={isSubmitting || !isValid || sharesLoading}
                type='submit'
                className='custom-main-btn'
              >
                {sharesLoading ? <Loader animation /> : formT('preview_deposit')}
              </Button>
              <DialogContent className='custom-dialog glass-card modal-card sm:max-w-md'>
                <div className='flex flex-col gap-2'>
                  <DialogHeader>
                    <DialogTitle className='text-2xl'>{formT('confirm_deposit')}</DialogTitle>
                  </DialogHeader>
                  <div className='flex-1'>
                    <div className='mt-4 flex flex-col gap-2'>
                      <div className='flex justify-between gap-2'>
                        <span>{t('amount')}</span>
                        <span>
                          {formatNumber(values.amount, lng)} {currency}
                        </span>
                      </div>
                      <div className='flex justify-between gap-2'>
                        <span>{formT('plp_output')}</span>
                        <span>{formattedEstimatedShares} PLP</span>
                      </div>
                      <div className='flex justify-between gap-2'>
                        <span>{formT('your_balance')}</span>
                        <span>
                          {formatNumber(balance, lng)} {currency}
                        </span>
                      </div>
                      <div className='flex justify-between gap-2'>
                        <span>{t('apy')}</span>
                        <span>{formatPercentage(apy ?? '0', lng)}</span>
                      </div>
                      <div className='flex justify-between gap-2'>
                        <span>{formT('some_token_exchange_rate', { token: 'PLP' })}</span>
                        <span>{formattedExchangeRate}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    disabled={!isValid}
                    type='button'
                    className='custom-main-btn'
                    onClick={handleDepositClick}
                  >
                    {t('deposit')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              disabled={!isValid}
              type='button'
              className='custom-main-btn'
              onClick={tonConnectModal.open}
            >
              {formT('connect_wallet_to_deposit')}
            </Button>
          )}
        </CardFooter>
      </Form>
    </FormikProvider>
  );
}
