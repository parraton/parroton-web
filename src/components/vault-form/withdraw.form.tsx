'use client';
/* eslint-disable react/jsx-no-literals */

import { CardContent, CardFooter } from '@UI/card';
import { Label } from '@UI/label';
import { Button } from '@UI/button';
import { ErrorMessage, Field, Form, FormikHelpers, FormikProvider, useFormik } from 'formik';
import { Input } from '@UI/input';
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
import { OrLoader } from '@components/loader/loader';
import { useDebouncedCallback } from 'use-debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVault } from '@core';
import { Address, fromNano, toNano } from '@ton/core';
import { useVaultData } from '@hooks/use-vault-data';
import useSWR from 'swr';
import { AssetAmountInput } from '@UI/asset-amount-input';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault: vaultAddress } = useParams(VaultPage);

  const { vault } = useVaultData(vaultAddress);
  const { balance } = useSharesBalance(vaultAddress);

  const [estimatedLp, setEstimatedLp] = useState<string>('');

  const getVaultContract = useCallback(
    ([, vaultAddress]: [string, string]) => getVault(Address.parse(vaultAddress)),
    [],
  );
  const { data: vaultContract } = useSWR(['vault-contract', vaultAddress], getVaultContract, {
    shouldRetryOnError: true,
    errorRetryInterval: 5000,
    suspense: false,
  });
  const fetchLpEquivalent = useDebouncedCallback(async (value) => {
    if (amountValidationSchema.safeParse(value).success === false) {
      setEstimatedLp('0');

      return;
    }

    const x = await (
      vaultContract ?? (await getVaultContract(['', vaultAddress]))
    ).getEstimatedLpAmount(toNano(value));

    setEstimatedLp(fromNano(x));
  }, 500);

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

  return {
    lpBalance: balance?.lpBalance,
    sharesBalance: balance?.sharesBalance,
    estimatedLp,
    fetchLpEquivalent,
    validate,
    currency: vault?.plpMetadata.symbol,
    lpPrice: vault?.lpPriceUsd,
    plpPrice: vault?.plpPriceUsd,
    outputTitle: t('lp_output'),
  };
};

export function WithdrawForm() {
  const { t, lng } = useTranslation({ ns: 'common' });
  const { withdraw } = useWithdraw();

  const {
    sharesBalance,
    estimatedLp,
    fetchLpEquivalent,
    validate,
    currency,
    plpPrice,
    outputTitle,
  } = useFormData();

  const onSubmit = useCallback(
    async (values: { amount: string }, actions: FormikHelpers<{ amount: string }>) => {
      actions.setSubmitting(true);
      try {
        await withdraw(values.amount.replace(',', '.'));
        // TODO: implement status tracking
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again later.');
      } finally {
        actions.setSubmitting(false);
        actions.resetForm();
      }
    },
    [withdraw],
  );
  const formik = useFormik({
    initialValues: {
      amount: '0',
    },
    validate,
    onSubmit,
  });
  const { isSubmitting, isValid, values, setValues } = formik;

  const handleMaxAmountClick = useCallback(() => {
    if (sharesBalance) {
      setValues((prevValues) => ({ ...prevValues, amount: sharesBalance }));
    }
  }, [sharesBalance, setValues]);

  useEffect(
    () => void fetchLpEquivalent(values.amount.replace(',', '.')),
    [fetchLpEquivalent, values.amount],
  );
  const dollarEquivalent = multiplyIfPossible(plpPrice, sharesBalance);

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
              {<OrLoader value={sharesBalance} modifier={(x) => formatNumber(x, lng)} />}{' '}
              {<OrLoader animation value={currency} />} (
              <OrLoader value={dollarEquivalent} modifier={(x) => formatCurrency(x, lng)} />)
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
            <Label>{outputTitle}</Label>
            <Field
              name='output'
              id='output'
              type='text'
              as={Input}
              readOnly
              value={formattedEstimatedLp}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' disabled={isSubmitting || !isValid} className='custom-main-btn'>
            {t('withdraw')}
          </Button>
        </CardFooter>
      </Form>
    </FormikProvider>
  );
}
