import { OrLoader } from '@components/loader/loader';
import { useTranslation } from '@i18n/client';
import { useTonConnectModal } from '@tonconnect/ui-react';
import { AssetAmountInputV2 } from '@UI/asset-amount-input-v2';
import { Form, FormikProvider, useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { Trans } from 'react-i18next';
import { toast } from 'sonner';
import { MainnetAction } from './types';
import { useFormData } from './use-form-data';
import { ActionsSwitcher } from './actions-switcher';
import { ButtonV2 } from '@UI/button-v2';
import { useIsFirstRender } from '@hooks/use-is-first-render';
import { ConfirmActionDialog } from './confirm-action-dialog';
import { FALLBACK_MAX_ASSET_VALUE } from '@lib/constants';

interface MainnetActionsFormProps {
  vaultAddress: string;
}

interface MainnetActionsFormValues {
  amount: string;
  action: MainnetAction;
}

export function MainnetActionsForm({ vaultAddress }: MainnetActionsFormProps) {
  const { t } = useTranslation({ ns: 'form' });
  const isFirstRender = useIsFirstRender();

  const tonConnectModal = useTonConnectModal();
  const [confirmIsOpen, handleConfirmOpenChange] = useState(false);

  const {
    apy,
    setInputAmount,
    setAction,
    maxValue,
    maxDepositValue,
    maxWithdrawValue,
    validate,
    shouldShowConnectButton,
    estimatedOutput,
    estimatedOutputLoading,
    inputBalance,
    inputBalanceLoading,
    shortInputSymbol,
    shortOutputSymbol,
    expectedYearlyYield,
    vaultIsLoading,
    inputAmountLpOrPlp,
    inputToOutputExchangeRate,
    fullInputSymbol,
    inputAssetExchangeRate,
    doAction,
  } = useFormData(vaultAddress);
  const onSubmit = useCallback(async () => {
    handleConfirmOpenChange(true);
  }, []);
  const formik = useFormik<MainnetActionsFormValues>({
    initialValues: {
      amount: maxValue,
      action: 'deposit',
    },
    validate,
    onSubmit,
  });
  const { errors, isSubmitting, isValid, values, setFieldValue, setValues } = formik;
  const { action, amount } = values;

  const resetValues = useCallback(
    (newAction: MainnetAction) => {
      const newAmount = newAction === 'deposit' ? maxDepositValue : maxWithdrawValue;
      setValues(() => ({ amount: newAmount, action: newAction }), true);
      setInputAmount(newAmount);
      setAction(newAction);
    },
    [maxDepositValue, maxWithdrawValue, setAction, setInputAmount, setValues],
  );

  const handleConfirmActionClick = useCallback(async () => {
    try {
      await doAction(inputAmountLpOrPlp);
      handleConfirmOpenChange(false);
      // TODO: implement status tracking
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      resetValues(action);
    }
  }, [doAction, inputAmountLpOrPlp, resetValues, action]);

  const handleAmountChange = useCallback(
    (newValue: string) => {
      setFieldValue('amount', newValue, true);
      setInputAmount(newValue);
    },
    [setFieldValue, setInputAmount],
  );
  const handleActionChange = useCallback(
    (newAction: MainnetAction) => {
      resetValues(newAction);
    },
    [resetValues],
  );

  return (
    <FormikProvider value={formik}>
      <Form className='flex w-full flex-col gap-4'>
        {(vaultIsLoading || expectedYearlyYield) && (
          <div className='flex justify-center'>
            <OrLoader
              animation={vaultIsLoading}
              value={expectedYearlyYield}
              modifier={(yearlyYield) => (
                <h1 className='text-center text-2xl font-bold'>
                  <Trans
                    i18nKey='form:deposit_header'
                    values={{ amount: yearlyYield, symbol: fullInputSymbol }}
                    components={{ 1: <span className='text-custom-link' />, 4: <span /> }}
                    tOptions={{ interpolation: { escapeValue: false } }}
                  />
                </h1>
              )}
            />
          </div>
        )}

        <AssetAmountInputV2
          value={amount}
          error={errors.amount}
          maxValueInAsset={inputBalance ?? FALLBACK_MAX_ASSET_VALUE}
          assetSymbol={fullInputSymbol ?? ''}
          assetExchangeRate={inputAssetExchangeRate ?? 1}
          shouldShowActualAssetPostfix
          onChange={handleAmountChange}
        >
          <ActionsSwitcher value={action} onChange={handleActionChange} />
        </AssetAmountInputV2>

        {shouldShowConnectButton || isFirstRender ? (
          <ButtonV2 disabled={!isValid} onClick={tonConnectModal.open}>
            {t(`connect_wallet_to_${action}`)}
          </ButtonV2>
        ) : (
          <ConfirmActionDialog
            open={confirmIsOpen}
            onOpenChange={handleConfirmOpenChange}
            triggerDisabled={isSubmitting || !isValid || estimatedOutputLoading}
            triggerLoading={isSubmitting && !isFirstRender}
            triggerButtonText={t(`preview_${action}`)}
            confirmActionText={t(`confirm_${action}`)}
            confirmButtonText={t(`${action}_title`)}
            inputAmountLabel={t(`you_${action}`)}
            inputAmount={inputAmountLpOrPlp}
            inputTokenSymbol={shortInputSymbol}
            outputAmount={estimatedOutput}
            outputTokenSymbol={shortOutputSymbol}
            inputBalance={inputBalance}
            inputBalanceLoading={inputBalanceLoading}
            apy={apy}
            apyIsLoading={vaultIsLoading}
            exchangeRate={inputToOutputExchangeRate}
            onConfirm={handleConfirmActionClick}
          />
        )}
      </Form>
    </FormikProvider>
  );
}
