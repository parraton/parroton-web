'use client';

import {CardContent, CardFooter} from '@UI/card';
import {Label} from '@UI/label';
import {Button} from '@UI/button';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {Input} from '@UI/input';
import {useWithdraw} from '@hooks/use-withdraw';
import {useTranslation} from '@i18n/client';
import {toFormikValidate} from "zod-formik-adapter";
import {z} from "zod";
import {cn, formatNumber} from "@lib/utils";
import {useSharesBalance} from "@hooks/use-shares-balance";
import {toast} from "sonner";
import {firstValueFrom} from "rxjs";
import {successTransaction} from "@utils/sender";
import Link from "next/link";

const useFormData = () => {
  const {t} = useTranslation({ns: 'form'});

  const {balance} = useSharesBalance();

  const validate = toFormikValidate(z.object({
    amount: z.number()
      .min(0, t('validation.min_withdraw', {minWithdraw: 0}))
      .max(Number(balance), t('validation.max_withdraw', {maxWithdraw: formatNumber(balance)}))
  }))

  return {balance, validate}
}

export function WithdrawForm() {
  const {t} = useTranslation({ns: 'common'});
  const {withdraw} = useWithdraw();

  const {balance, validate} = useFormData();

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
            </div>
          );

          const successHash = await firstValueFrom(successTransaction)

          //TODO: make component for toast
          toast.success(
            <div>
              <div>Transaction is complete</div>
              <Link href={`${process.env.NEXT_PUBLIC_TONVIEWER_URL}/transactions/${successHash}`}>View
                transaction</Link>
            </div>
          );
        } catch (e) {
          console.error(e)
          toast.error('Something went wrong. Please try again later.');
        } finally {
          actions.setSubmitting(false);
          actions.resetForm();
        }
      }}
    >
      <Form>
        <CardContent className='space-y-2'>
          <div className='space-y-1'>
            <Label htmlFor='current'>{t('amount')}. Balance: {formatNumber(balance)}</Label>
            <Field name='amount' id='current' type='number' as={Input}/>
            <ErrorMessage className={cn('text-red-500 text-sm', 'mt-1')} component='div' name='amount'/>
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit'>{t('submit')}</Button>
        </CardFooter>
      </Form>
    </Formik>
  );
}
