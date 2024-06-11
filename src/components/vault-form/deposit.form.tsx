'use client';

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
import { TonviewerLink } from '@components/tonviewer-link';
import { successTransaction } from '@utils/transaction-subjects';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useVaultMetadata } from '@hooks/use-vault-metadata';
import { useVaultTvl } from '@hooks/use-vault-tvl';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { OrLoader } from '@components/loader/loader';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault } = useParams(VaultPage);
  const { tvlData } = useVaultTvl(vault);
  const { metadata } = useVaultMetadata(vault);
  const { balance } = useLpBalance(vault);

  const validate = toFormikValidate(
    z.object({
      amount: z
        .number()
        .min(0, t('validation.min_deposit', { minDeposit: 0 }))
        .max(Number(balance), t('validation.max_deposit', { maxDeposit: formatNumber(balance) })),
    }),
  );

  console.log({ tvlData });

  return {
    balance,
    validate,
    currency: metadata?.symbol,
    dollarEquivalent: multiplyIfPossible(tvlData?.priceForOne, balance),
  };
};

export function DepositForm() {
  const { t, lng } = useTranslation({ ns: 'common' });
  const { deposit } = useDeposit();
  const { balance, validate, currency, dollarEquivalent } = useFormData();

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

          toast.info(
            <div>
              <div>Transaction has been sent</div>
            </div>,
          );

          const successHash = await firstValueFrom(successTransaction);

          console.log('Transaction is complete', { successHash });

          //TODO: make component for toast
          toast.success(
            <div>
              <div>Transaction is complete</div>
              <TonviewerLink hash={successHash} />
            </div>,
          );
        } catch (error) {
          console.error(error);
          toast.error('Something went wrong. Please try again later.');
        } finally {
          actions.setSubmitting(false);
          actions.resetForm();
        }
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <CardContent className='space-y-2'>
            <div className='space-y-1'>
              <Label className={'flex items-center gap-1'} htmlFor='amount'>
                {t('amount')}: {<OrLoader value={balance} modifier={(x) => formatNumber(x, lng)} />}{' '}
                {<OrLoader value={currency} />} (
                <OrLoader value={dollarEquivalent} modifier={(x) => formatCurrency(x, lng)} />)
              </Label>
              <Field name='amount' id='amount' type='number' as={Input} />
              <ErrorMessage
                className={cn('text-sm text-red-500', 'mt-1')}
                component='div'
                name='amount'
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isSubmitting || !isValid} type='submit' className='custom-main-btn'>
              {t('deposit')}
            </Button>
          </CardFooter>
        </Form>
      )}
    </Formik>
  );
}
