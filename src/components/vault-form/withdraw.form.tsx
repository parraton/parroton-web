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
import { errorTransaction, successTransaction } from '@utils/transaction-subjects';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useVaultMetadata } from '@hooks/use-vault-metadata';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { useVaultTvl } from '@hooks/use-vault-tvl';
import { OrLoader } from '@components/loader/loader';
import { TransactionSent } from '@components/transactions/sent';
import { useDebouncedCallback } from 'use-debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVault } from '@core';
import { Address, fromNano, toNano } from '@ton/core';
import { TransactionCompleted } from '@components/transactions/completed';
import { TransactionFailed } from '@components/transactions/failed';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault } = useParams(VaultPage);
  const { tvlData } = useVaultTvl(vault);
  const { metadata } = useVaultMetadata(vault);
  const { balance } = useSharesBalance(vault);

  const [estimatedLp, setEstimatedLp] = useState<string>('');

  const fetchLpEquivalent = useDebouncedCallback(async (value) => {
    const v = await getVault(Address.parse(vault));
    const x = await v.getEstimatedLpAmount(toNano(value));

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
    currency: metadata?.symbol,
    lpPrice: tvlData?.priceForOne,
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
    lpPrice,
    outputTitle,
  } = useFormData();

  const onSubmit = useCallback(
    async (values: { amount: string }, actions: FormikHelpers<{ amount: string }>) => {
      actions.setSubmitting(true);
      try {
        await withdraw(values.amount);

        toast.info(<TransactionSent />);

        await new Promise<void>((resolve) => {
          const successSub = successTransaction.subscribe((successHash) => {
            toast.success(<TransactionCompleted hash={successHash} />);
            successSub.unsubscribe();
            errorSub.unsubscribe();
            resolve();
          });
          const errorSub = errorTransaction.subscribe((error) => {
            console.error(error);
            toast.error(<TransactionFailed />);
            successSub.unsubscribe();
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

  useEffect(() => void fetchLpEquivalent(values.amount), [fetchLpEquivalent, values.amount]);
  const dollarEquivalent = multiplyIfPossible(lpPrice, sharesBalance);

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
              <OrLoader value={dollarEquivalent} modifier={(x) => formatCurrency(x)} />)
            </Label>
            <Field
              name='amount'
              id='current'
              type='text'
              as={Input}
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
