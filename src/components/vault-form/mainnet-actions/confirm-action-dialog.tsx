import { Loader, OrLoader } from '@components/loader/loader';
import { useTranslation } from '@i18n/client';
import { formatNumberWithDigitsLimit, formatPercentage } from '@lib/utils';
import { Maybe } from '@types';
import { ButtonV2 } from '@UI/button-v2';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@UI/dialog';
import BigNumber from 'bignumber.js';
import { ReactNode } from 'react';

interface ConfirmActionDialogProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  triggerDisabled: boolean;
  triggerLoading: boolean;
  triggerButtonText: string;
  confirmActionText: string;
  confirmButtonText: string;
  inputAmountLabel: string;
  inputAmount: Maybe<BigNumber.Value>;
  inputTokenSymbol: string;
  outputAmount: Maybe<BigNumber.Value>;
  outputTokenSymbol: string;
  inputBalance: Maybe<BigNumber.Value>;
  inputBalanceLoading: boolean;
  apy: Maybe<string>;
  apyIsLoading: boolean;
  exchangeRate: Maybe<BigNumber.Value>;
  onConfirm: () => void;
}

export const ConfirmActionDialog = ({
  open,
  onOpenChange,
  triggerDisabled,
  triggerLoading,
  triggerButtonText,
  confirmActionText,
  confirmButtonText,
  inputAmountLabel,
  inputAmount,
  inputTokenSymbol,
  outputAmount,
  outputTokenSymbol,
  inputBalance,
  inputBalanceLoading,
  apy,
  apyIsLoading,
  exchangeRate,
  onConfirm,
}: ConfirmActionDialogProps) => {
  const { t: commonT } = useTranslation({ ns: 'common' });
  const { t, lng } = useTranslation({ ns: 'form' });

  return (
    <>
      <ButtonV2 disabled={triggerDisabled} type='submit'>
        {triggerLoading ? <Loader animation /> : triggerButtonText}
      </ButtonV2>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>{confirmActionText}</DialogTitle>

          <div className='flex flex-1 flex-col gap-3 text-lg leading-tight'>
            <NanoInfoPlate
              name={inputAmountLabel}
              value={inputAmount}
              modifier={(x) => `${formatNumberWithDigitsLimit(x, lng)} ${inputTokenSymbol}`}
              loading={false}
            />

            <NanoInfoPlate
              name={t('you_get')}
              value={outputAmount}
              modifier={(x) => `${formatNumberWithDigitsLimit(x, lng)} ${outputTokenSymbol}`}
              loading={false}
            />

            <NanoInfoPlate
              name={t('your_balance')}
              value={inputBalance}
              modifier={(x) => `${formatNumberWithDigitsLimit(x, lng)} ${inputTokenSymbol}`}
              loading={inputBalanceLoading}
            />

            <NanoInfoPlate
              name={commonT('apy')}
              value={apy}
              modifier={(x) => formatPercentage(x, lng)}
              loading={apyIsLoading}
            />

            <NanoInfoPlate
              name={t('some_token_exchange_rate', { token: outputTokenSymbol })}
              value={exchangeRate}
              modifier={(x) =>
                `1 ${outputTokenSymbol} = ${formatNumberWithDigitsLimit(x, lng, 4)} ${inputTokenSymbol}`
              }
            />
          </div>
          <DialogFooter className='w-full'>
            <ButtonV2 onClick={onConfirm}>{confirmButtonText}</ButtonV2>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface NanoInfoPlateProps<T extends BigNumber.Value> {
  name: string;
  value: Maybe<T>;
  // eslint-disable-next-line no-unused-vars
  modifier: (value: T) => ReactNode;
  loading?: boolean;
}

const NanoInfoPlate = <T extends BigNumber.Value>({
  name,
  value,
  modifier,
  loading,
}: NanoInfoPlateProps<T>) => (
  <div className='flex items-center justify-between gap-3'>
    <span className='font-semibold'>{name}</span>
    <OrLoader
      animation={loading}
      value={value}
      modifier={(x) => <span className='font-medium text-custom-link'>{modifier(x)}</span>}
    />
  </div>
);