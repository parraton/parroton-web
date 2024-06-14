'use client';
/* eslint-disable react/jsx-no-literals */

import { CardContent, CardFooter } from '@UI/card';
import { Label } from '@UI/label';
import { Button } from '@UI/button';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import { Input } from '@UI/input';
import { useDeposit } from '@hooks/use-deposit';
import { useTranslation } from '@i18n/client';
import { useLpBalance } from '@hooks/use-lp-balance';
import { cn, formatCurrency, formatNumber } from '@lib/utils';
import { toFormikValidate } from 'zod-formik-adapter';
import { z } from 'zod';
import { firstValueFrom } from 'rxjs';
import { toast } from 'sonner';
import { successTransaction } from '@utils/transaction-subjects';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useVaultTvl } from '@hooks/use-vault-tvl';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { OrLoader } from '@components/loader/loader';
import { TransactionSent } from '@components/transactions/sent';
import { TransactionCompleted } from '@components/transactions/completed';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { getVault } from '@core';
import { Address, fromNano, toNano } from '@ton/core';
import { usePoolMetadata } from '@hooks/use-pool-metadata';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault } = useParams(VaultPage);
  const { tvlData } = useVaultTvl(vault);
  const { metadata } = usePoolMetadata(vault);
  const { balance } = useLpBalance(vault);

  const [estimatedShares, setEstimatedShares] = useState<string>('');

  const fetchSharesEquivalent = useDebouncedCallback(async (value) => {
    const v = await getVault(Address.parse(vault));
    const x = await v.getEstimatedLpAmount(toNano(value));

    setEstimatedShares(fromNano(x));
  }, 500);

  const validate = toFormikValidate(
    z.object({
      amount: z
        .number()
        .gt(0, t('validation.min_deposit', { minDeposit: 0 }))
        .lte(Number(balance), t('validation.max_deposit', { maxDeposit: formatNumber(balance) })),
    }),
  );

  return {
    balance,
    estimatedShares,
    fetchSharesEquivalent,
    validate,
    currency: metadata?.symbol,
    dollarEquivalent: multiplyIfPossible(tvlData?.priceForOne, balance),
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

  return (
    <Formik
      initialValues={{
        amount: 0,
      }}
      validate={validate}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        try {
          await deposit(values.amount);

          toast.info(<TransactionSent />);

          const successHash = await firstValueFrom(successTransaction);

          //TODO: make component for toast
          toast.success(<TransactionCompleted hash={successHash} />);
        } catch (error) {
          console.error(error);
          toast.error('Something went wrong. Please try again later.');
        } finally {
          actions.setSubmitting(false);
          actions.resetForm();
        }
      }}
    >
      {({ isSubmitting, isValid, values }) => {
        void fetchSharesEquivalent(values.amount);
        return (
          <Form>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label className={'flex items-center gap-1'} htmlFor='amount'>
                  {t('amount')}:{' '}
                  {<OrLoader value={balance} modifier={(x) => formatNumber(x, lng)} />}{' '}
                  {<OrLoader value={currency} />} (
                  <OrLoader value={dollarEquivalent} modifier={(x) => formatCurrency(x, lng)} />)
                </Label>
                <Field name='amount' id='amount' type='number' as={Input} />
                <ErrorMessage
                  className={cn('text-sm text-red-500', 'mt-1')}
                  component='div'
                  name='amount'
                />
                <Label>{outputTitle}</Label>
                <Field
                  name='output'
                  id='output'
                  type='number'
                  as={Input}
                  readOnly
                  value={estimatedShares}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={isSubmitting || !isValid} type='submit' className='custom-main-btn'>
                {t('deposit')}
              </Button>
            </CardFooter>
          </Form>
        );
      }}
    </Formik>
  );
}
