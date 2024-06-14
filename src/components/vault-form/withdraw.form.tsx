'use client';
/* eslint-disable react/jsx-no-literals */

import { CardContent, CardFooter } from '@UI/card';
import { Label } from '@UI/label';
import { Button } from '@UI/button';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Input } from '@UI/input';
import { useWithdraw } from '@hooks/use-withdraw';
import { useTranslation } from '@i18n/client';
import { toFormikValidate } from 'zod-formik-adapter';
import { z } from 'zod';
import { cn, formatCurrency, formatNumber } from '@lib/utils';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { toast } from 'sonner';
import { firstValueFrom } from 'rxjs';
import { TonviewerLink } from '@components/tonviewer-link';
import { successTransaction } from '@utils/transaction-subjects';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useVaultMetadata } from '@hooks/use-vault-metadata';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { useVaultTvl } from '@hooks/use-vault-tvl';
import { OrLoader } from '@components/loader/loader';
import { TransactionSent } from '@components/transactions/sent';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import { getVault } from '@core';
import { Address, fromNano, toNano } from '@ton/core';

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

  const validate = toFormikValidate(
    z.object({
      amount: z
        .number()
        .gt(0, t('validation.min_withdraw', { minWithdraw: 0 }))
        .lte(
          Number(balance?.lpBalance),
          t('validation.max_withdraw', {
            maxWithdraw: formatNumber(balance?.lpBalance),
          })
        ),
    })
  );

  return {
    balance: balance?.lpBalance,
    estimatedLp,
    fetchSharesEquivalent: fetchLpEquivalent,
    validate,
    currency: metadata?.symbol,
    dollarEquivalent: multiplyIfPossible(
      tvlData?.priceForOne,
      balance?.lpBalance
    ),
    outputTitle: t('lp_output'),
  };
};

export function WithdrawForm() {
  const { t, lng } = useTranslation({ ns: 'common' });
  const { withdraw } = useWithdraw();

  const {
    balance,
    estimatedLp,
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
          await withdraw(values.amount);

          toast.info(<TransactionSent />);

          const successHash = await firstValueFrom(successTransaction);

          toast.success(<TonviewerLink hash={successHash} />);
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
        console.log('values.amount', values.amount);
        return (
          <Form>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label className={'flex items-center gap-1'} htmlFor='amount'>
                  {t('amount')}:{' '}
                  {
                    <OrLoader
                      value={balance}
                      modifier={(x) => formatNumber(x, lng)}
                    />
                  }{' '}
                  {<OrLoader value={currency} />} (
                  <OrLoader
                    value={dollarEquivalent}
                    modifier={(x) => formatCurrency(x, lng)}
                  />
                  )
                </Label>
                <Field name='amount' id='current' type='number' as={Input} />
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
                  value={estimatedLp}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type='submit'
                disabled={isSubmitting || !isValid}
                className='custom-main-btn'
              >
                {t('withdraw')}
              </Button>
            </CardFooter>
          </Form>
        );
      }}
    </Formik>
  );
}
