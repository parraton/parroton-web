'use client';
/* eslint-disable react/jsx-no-literals */

import { CardContent, CardFooter } from '@UI/card';
import { Label } from '@UI/label';
import { Button } from '@UI/button';
import { ErrorMessage, Form, Field, useFormik, FormikHelpers, FormikProvider } from 'formik';
import { Input } from '@UI/input';
import { useDeposit } from '@hooks/use-deposit';
import { useTranslation } from '@i18n/client';
import { useLpBalance } from '@hooks/use-lp-balance';
import { cn, formatCurrency, formatNumber, getAmountAsStringValidationSchema } from '@lib/utils';
import { toFormikValidate } from 'zod-formik-adapter';
import { z } from 'zod';
import { toast } from 'sonner';
import { errorTransaction, successTransaction } from '@utils/transaction-subjects';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { OrLoader } from '@components/loader/loader';
import { TransactionCompleted } from '@components/transactions/completed';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getVault } from '@core';
import { Address, fromNano, toNano } from '@ton/core';
import { useVaultData } from '@hooks/use-vault-data';
import useSWR from 'swr';
import { TransactionFailed } from '@components/transactions/failed';
import { AssetAmountInput } from '@UI/asset-amount-input';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault: vaultAddress } = useParams(VaultPage);
  const { vault } = useVaultData(vaultAddress);
  const { balance } = useLpBalance(vaultAddress);

  const [estimatedShares, setEstimatedShares] = useState<string>('');

  const getVaultContract = useCallback(
    ([, vaultAddress]: [string, string]) => getVault(Address.parse(vaultAddress)),
    [],
  );
  const { data: vaultContract } = useSWR(['vault-contract', vaultAddress], getVaultContract, {
    shouldRetryOnError: true,
    errorRetryInterval: 5000,
    suspense: false,
  });

  const fetchSharesEquivalent = useDebouncedCallback(async (value: string) => {
    if (amountValidationSchema.safeParse(value).success === false) {
      setEstimatedShares('0');

      return;
    }

    const x = await (
      vaultContract ?? (await getVaultContract(['', vaultAddress]))
    ).getEstimatedSharesAmount(toNano(value));

    setEstimatedShares(fromNano(x));
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

  return {
    balance,
    estimatedShares,
    fetchSharesEquivalent,
    validate,
    currency: vault?.lpMetadata.symbol,
    dollarEquivalent: multiplyIfPossible(vault?.lpPriceUsd, balance),
    outputTitle: t('plp_output'),
  };
};

export function DepositForm() {
  const { t, lng } = useTranslation({ ns: 'common' });
  const { deposit } = useDeposit();
  const {
    balance,
    estimatedShares,
    fetchSharesEquivalent,
    validate,
    currency,
    dollarEquivalent,
    outputTitle,
  } = useFormData();

  const onSubmit = useCallback(
    async (values: { amount: string }, actions: FormikHelpers<{ amount: string }>) => {
      actions.setSubmitting(true);
      try {
        await deposit(values.amount.replace(',', '.'));

        await new Promise<void>((resolve) => {
          const successSub = successTransaction.subscribe((successHash) => {
            toast.success(<TransactionCompleted hash={successHash} />);
            successSub.unsubscribe();
            resolve();
          });
          const errorSub = errorTransaction.subscribe((error) => {
            console.error(error);
            toast.error(<TransactionFailed />);
            errorSub.unsubscribe();
            resolve();
          });
        });
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again later.');
      } finally {
        actions.setSubmitting(false);
        actions.resetForm();
      }
    },
    [deposit],
  );

  const formik = useFormik({
    initialValues: {
      amount: balance ?? '0',
    },
    validate,
    onSubmit,
  });
  const { isSubmitting, isValid, values, setValues } = formik;

  useEffect(
    () => void fetchSharesEquivalent(values.amount),
    [fetchSharesEquivalent, values.amount],
  );

  const handleMaxAmountClick = useCallback(() => {
    if (balance) {
      setValues((prevValues) => ({ ...prevValues, amount: balance }));
    }
  }, [balance, setValues]);

  const formattedEstimatedShares = useMemo(
    () => estimatedShares && formatNumber(estimatedShares, lng),
    [estimatedShares, lng],
  );

  return (
    <FormikProvider value={formik}>
      <Form>
        <CardContent className='space-y-2'>
          <div className='space-y-1'>
            <Label className={'flex items-center gap-1'} htmlFor='amount'>
              {t('amount')}: {<OrLoader value={balance} modifier={(x) => formatNumber(x, lng)} />}{' '}
              {<OrLoader animation value={currency} />} (
              <OrLoader value={dollarEquivalent} modifier={(x) => formatCurrency(x, lng)} />)
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
            <Label>{outputTitle}</Label>
            <Field
              name='output'
              id='output'
              type='text'
              as={Input}
              readOnly
              value={formattedEstimatedShares}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={isSubmitting || !isValid} type='submit' className='custom-main-btn'>
            {t('deposit')}
          </Button>
        </CardFooter>
      </Form>
    </FormikProvider>
  );
}
