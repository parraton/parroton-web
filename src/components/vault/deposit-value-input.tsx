import { GlassCard } from '@components/glass-card';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { useTonBalance } from '@hooks/use-ton-balance';
import { useTonPrice } from '@hooks/use-ton-price';
import { useTranslation } from '@i18n/client';
import { Currency } from '@types';
import BigNumber from 'bignumber.js';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface DepositValueInputProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}

const FALLBACK_TON_PRICE = 5.5;
const FALLBACK_BALANCE = 1000;

export const DepositValueInput: FC<DepositValueInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation({ ns: 'vault-card' });

  const { tonPrice = FALLBACK_TON_PRICE } = useTonPrice();
  const { preferredCurrency } = usePreferredCurrency();
  const prevPreferredCurrencyRef = useRef(preferredCurrency);
  const { balance } = useTonBalance();
  const maxSliderValue = useMemo(
    () =>
      new BigNumber(balance ?? FALLBACK_BALANCE)
        .times(preferredCurrency === Currency.USD ? tonPrice : 1)
        .decimalPlaces(2, BigNumber.ROUND_FLOOR),
    [balance, preferredCurrency, tonPrice],
  );
  const prevMaxSliderValueRef = useRef(maxSliderValue);
  const sliderShiftQuotient = useMemo(
    () =>
      maxSliderValue.isZero()
        ? 1
        : Math.min(new BigNumber(value).div(maxSliderValue).toNumber(), 1),
    [maxSliderValue, value],
  );
  const [numberInputValue, setNumberInputValue] = useState(value);

  const setValue = useCallback(
    (newValue: BigNumber) => {
      setNumberInputValue(newValue.toString());
      onChange(newValue.toString());
    },
    [onChange],
  );

  useEffect(() => {
    if (
      maxSliderValue.isLessThan(value) &&
      !prevMaxSliderValueRef.current.isEqualTo(maxSliderValue)
    ) {
      prevMaxSliderValueRef.current = maxSliderValue;
      setValue(maxSliderValue);
    }
    if (prevPreferredCurrencyRef.current !== preferredCurrency) {
      prevPreferredCurrencyRef.current = preferredCurrency;
      const unroundedValue =
        preferredCurrency === Currency.USD
          ? new BigNumber(value).times(tonPrice)
          : new BigNumber(value).div(tonPrice);
      setValue(unroundedValue.decimalPlaces(2, BigNumber.ROUND_FLOOR));
    }
  }, [value, maxSliderValue, onChange, preferredCurrency, setValue, tonPrice]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setNumberInputValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  const handleNumberInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRawValue = e.target.value;

      if (/[^\d,.]/.test(newRawValue)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const parsedValue = new BigNumber(newRawValue.replace(',', '.')).decimalPlaces(
        2,
        BigNumber.ROUND_FLOOR,
      );

      if (!parsedValue.isFinite() || parsedValue.isNegative()) {
        setNumberInputValue(newRawValue);

        return;
      }

      const newValue = parsedValue.toString();
      const decimalSeparatorIndex = Math.max(
        ...[',', '.'].map((separator) => newRawValue.indexOf(separator)),
      );
      setNumberInputValue(
        decimalSeparatorIndex === -1
          ? newRawValue
          : newRawValue.slice(0, decimalSeparatorIndex + 3),
      );
      onChange(newValue);
    },
    [onChange],
  );

  const handleMaxButtonClick = useCallback(
    () => setValue(maxSliderValue),
    [maxSliderValue, setValue],
  );

  return (
    <div className='custom-wrapper'>
      <GlassCard className='overflow-hidden'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2 px-4 pt-4'>
            <div className='flex items-center justify-between'>
              <span>{t('you_deposit')}</span>

              <button type='button' onClick={handleMaxButtonClick} className='custom-card-link'>
                {t('use_max')}
              </button>
            </div>

            <div className='flex max-w-full items-center text-ellipsis whitespace-pre text-xl font-bold'>
              <label
                data-currency-prefix={preferredCurrency === Currency.USD ? '$\u00A0' : ''}
                data-currency-suffix={
                  preferredCurrency === Currency.USD ? '' : `\u00A0${preferredCurrency}`
                }
                className='custom-text-like-asset-input inline-flex cursor-text'
              >
                <span className='relative inline-flex min-w-3 max-w-full shrink whitespace-pre'>
                  <input
                    className='bg-transparent'
                    type='text'
                    inputMode='numeric'
                    style={{ width: `${numberInputValue.length}ch`, minWidth: '1ch' }}
                    value={numberInputValue}
                    onChange={handleNumberInputChange}
                  />
                </span>
              </label>
            </div>
          </div>

          <div className='relative h-12 w-full touch-none'>
            <input
              type='range'
              min='0'
              max={maxSliderValue.toString()}
              step='0.01'
              value={BigNumber.max(value, maxSliderValue).toString()}
              className='box-border size-full cursor-pointer appearance-none bg-secondary pl-5'
              onChange={handleSliderChange}
            />

            <div
              className='pointer-events-none absolute left-0 top-0 flex h-full items-center bg-primary-foreground'
              style={{
                width: `calc(2.5rem * ${1 - sliderShiftQuotient} + 100% * ${sliderShiftQuotient})`,
              }}
            >
              <div className='custom-slider-thumb' />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
