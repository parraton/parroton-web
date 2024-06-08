'use client';

import { CardContent, CardFooter } from '@UI/card';
import { Label } from '@UI/label';
import { Button } from '@UI/button';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Input } from '@UI/input';
import { useWithdraw } from '@hooks/use-withdraw';
import { useTranslation } from '@i18n/client';
import { toFormikValidate } from 'zod-formik-adapter';
import { z } from 'zod';
import { cn, formatNumber } from '@lib/utils';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { toast } from 'sonner';
import { firstValueFrom } from 'rxjs';
import { TonviewerLink } from '@components/tonviewer-link';
import { successTransaction } from '@utils/transaction-subjects';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';

const useFormData = () => {
  const { t } = useTranslation({ ns: 'form' });
  const { vault } = useParams(VaultPage);

  const { balance } = useSharesBalance(vault);

  const validate = toFormikValidate(
    z.object({
      amount: z
        .number()
        .min(0, t('validation.min_withdraw', { minWithdraw: 0 }))
        .max(Number(balance), t('validation.max_withdraw', { maxWithdraw: formatNumber(balance) })),
    }),
  );

  return { balance, validate };
};

export function WithdrawForm() {
  const { t, lng } = useTranslation({ ns: 'common' });
  const { withdraw } = useWithdraw();

  const { balance, validate } = useFormData();

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

          // const hash = await firstValueFrom(hashTransaction);

          toast.info(
            <div>
              <div>Transaction has been sent</div>
            </div>,
          );

          const successHash = await firstValueFrom(successTransaction);

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
      {({ isSubmitting, isValid }) => {
        return (
          <Form>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='current'>
                  {t('amount')}. Balance: {formatNumber(balance, lng)}
                </Label>
                <Field name='amount' id='current' type='number' as={Input} />
                <ErrorMessage
                  className={cn('text-sm text-red-500', 'mt-1')}
                  component='div'
                  name='amount'
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit' disabled={isSubmitting || !isValid} className='custom-main-btn'>
                {t('withdraw')}
              </Button>
            </CardFooter>
          </Form>
        );
      }}
    </Formik>
  );
}
