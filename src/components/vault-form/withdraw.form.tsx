'use client';
/* eslint-disable react/jsx-no-literals */

import { CardContent, CardFooter } from '@UI/card';
import { Label } from '@UI/label';
import { Button } from '@UI/button';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { useWithdraw } from '@hooks/use-withdraw';
import { useTranslation } from '@i18n/client';
import { toFormikValidate } from 'zod-formik-adapter';
import { z } from 'zod';
import { cn, formatCurrency, formatNumber, getAmountAsStringValidationSchema } from '@lib/utils';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { Loader, OrLoader } from '@components/loader/loader';
import { useDebouncedCallback } from 'use-debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVault } from '@core';
import { Address, fromNano, toNano } from '@ton/core';
import { useVaultData } from '@hooks/use-vault-data';
import useSWR from 'swr';
import { AssetAmountInput } from '@UI/asset-amount-input';
import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@UI/dialog';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault: vaultAddress } = useParams(VaultPage);
  const { vault, error: vaultError } = useVaultData(vaultAddress);
  const { balance, error: balanceError } = useSharesBalance(vaultAddress);
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
          min: (amount: string | number) => t('validation.min_withdraw', { minWithdraw: amount }),
          max: (amount: string | number) => t('validation.max_withdraw', { maxWithdraw: amount }),
        },
        {
          required: true,
          min: 0,
          max: balance?.sharesBalance ?? undefined,
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

  const fetchLpEquivalent = useCallback(
    async ([, inputAmount, vaultAddress]: [string, string, string]) => {
      if (amountValidationSchema.safeParse(inputAmount).success === false) {
        return '0';
      }

      const x = await (
        vaultContract ?? (await getVaultContract(['', vaultAddress]))
      ).getEstimatedLpAmount(toNano(inputAmount.replace(',', '.')));

      return fromNano(x);
    },
    [amountValidationSchema, getVaultContract, vaultContract],
  );
  const { data: estimatedLp, error: estimatedLpError } = useSWR(
    ['withdraw-estimated-lp', inputAmount, vaultAddress, balance],
    fetchLpEquivalent,
    {
      refreshInterval: 10_000,
      shouldRetryOnError: true,
      errorRetryInterval: 1000,
      suspense: false,
    },
  );

  const balancesLoading = !balanceError && balance === undefined;
  const currencyIsLoading = !vaultError && !vault;
  const plpPrice = vault?.plpPriceUsd;
  const sharesBalance = balance?.sharesBalance;
  const lpLoading = !estimatedLp && !estimatedLpError;

  return {
    balancesLoading,
    currencyIsLoading,
    dollarEquivalentIsLoading: balancesLoading || currencyIsLoading,
    lpBalance: balance?.lpBalance,
    sharesBalance,
    lpLoading: lpLoading,
    walletAddress,
    estimatedLp,
    triggerUpdateLpEquivalent: setInputAmountDebounced,
    validate,
    currency: vault?.plpMetadata.symbol,
    lpPrice: vault?.lpPriceUsd,
    plpPrice,
    outputTitle: t('lp_output'),
    dollarEquivalent: multiplyIfPossible(plpPrice, sharesBalance),
  };
};

export function WithdrawForm() {
  const { t, lng } = useTranslation({ ns: 'common' });
  const { withdraw } = useWithdraw();

  const {
    balancesLoading,
    currencyIsLoading,
    dollarEquivalentIsLoading,
    sharesBalance,
    estimatedLp,
    triggerUpdateLpEquivalent,
    walletAddress,
    validate,
    currency,
    outputTitle,
    dollarEquivalent,
    lpLoading,
  } = useFormData();
  const tonConnectModal = useTonConnectModal();
  const [confirmIsOpen, handleConfirmOpenChange] = useState(false);

  const onSubmit = useCallback(async () => {
    handleConfirmOpenChange(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      amount: '0',
    },
    validate,
    onSubmit,
  });
  const { isSubmitting, isValid, values, setValues, resetForm } = formik;

  const handleWithdrawClick = useCallback(async () => {
    try {
      await withdraw(values.amount.replace(',', '.'));
      // TODO: implement status tracking
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      resetForm();
    }
  }, [resetForm, values.amount, withdraw]);

  const handleMaxAmountClick = useCallback(() => {
    if (sharesBalance) {
      setValues((prevValues) => ({ ...prevValues, amount: sharesBalance }));
    }
  }, [sharesBalance, setValues]);

  useEffect(
    () => triggerUpdateLpEquivalent(values.amount),
    [triggerUpdateLpEquivalent, values.amount],
  );

  const formattedEstimatedLp = useMemo(
    () => estimatedLp && formatNumber(estimatedLp, lng),
    [estimatedLp, lng],
  );

  return (
    <FormikProvider value={formik}>
      <Form>
        <CardContent className='space-y-2'>
          <div className='space-y-1'>
            <Label className={'flex items-center gap-1'} htmlFor='amount'>
              {t('amount')}:{' '}
              {
                <OrLoader
                  animation={balancesLoading}
                  value={sharesBalance}
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
              id='current'
              type='text'
              as={AssetAmountInput}
              placeholder='0'
              onMaxAmountClick={sharesBalance && handleMaxAmountClick}
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
                disabled={isSubmitting || !isValid || lpLoading}
                type='submit'
                className='custom-main-btn'
              >
                {lpLoading ? <Loader animation /> : t('withdraw')}
              </Button>
              <DialogContent className='custom-dialog glass-card modal-card sm:max-w-md'>
                <div className='p-6'>
                  <DialogHeader>
                    <DialogTitle className='text-2xl'>{t('confirm_withdraw')}</DialogTitle>
                  </DialogHeader>
                  <div className='mt-4 flex flex-col gap-2'>
                    <div className='flex justify-between gap-2'>
                      <span>{t('amount')}</span>
                      <span>{formatNumber(values.amount, lng)}</span>
                    </div>
                    <div className='flex justify-between gap-2'>
                      <span>{outputTitle}</span>
                      <span>{formattedEstimatedLp}</span>
                    </div>
                    <Button
                      disabled={!isValid}
                      type='button'
                      className='custom-main-btn'
                      onClick={handleWithdrawClick}
                    >
                      {t('withdraw')}
                    </Button>
                  </div>
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
              {t('connect_wallet_to_withdraw')}
            </Button>
          )}
        </CardFooter>
      </Form>
    </FormikProvider>
  );
}
