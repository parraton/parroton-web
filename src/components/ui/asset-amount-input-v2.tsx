import { GlassCard } from '@components/glass-card';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { useTonPrice } from '@hooks/use-ton-price';
import { useTranslation } from '@i18n/client';
import { FALLBACK_TON_PRICE } from '@lib/constants';
import { Currency } from '@types';
import BigNumber from 'bignumber.js';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface AssetAmountInputV2Props {
  children?: React.ReactNode | React.ReactNode[];
  value: string;
  error?: string;
  maxValueTon: string;
  numberInputPostfix?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}

const DECIMAL_PLACES = 2;
const SLIDER_STEP = new BigNumber(10).pow(-DECIMAL_PLACES).toString();

export const AssetAmountInputV2: FC<AssetAmountInputV2Props> = ({
  children,
  value,
  error,
  numberInputPostfix = '',
  maxValueTon,
  onChange,
}) => {
  const { t } = useTranslation({ ns: 'vault-card' });

  const { tonPrice = FALLBACK_TON_PRICE } = useTonPrice();
  const { preferredCurrency: currency } = usePreferredCurrency();
  const prevCurrencyRef = useRef(currency);
  const maxSliderValue = useMemo(
    () =>
      new BigNumber(maxValueTon)
        .times(currency === Currency.USD ? tonPrice : 1)
        .decimalPlaces(DECIMAL_PLACES, BigNumber.ROUND_FLOOR),
    [currency, maxValueTon, tonPrice],
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
    if (prevCurrencyRef.current !== currency) {
      prevCurrencyRef.current = currency;
      const unroundedValue =
        currency === Currency.USD
          ? new BigNumber(value).times(tonPrice)
          : new BigNumber(value).div(tonPrice);
      setValue(unroundedValue.decimalPlaces(DECIMAL_PLACES, BigNumber.ROUND_FLOOR));
    }
    if (!prevMaxSliderValueRef.current.eq(maxSliderValue)) {
      if (prevMaxSliderValueRef.current.eq(value)) {
        setValue(maxSliderValue);
      }
      prevMaxSliderValueRef.current = maxSliderValue;
    }
  }, [value, maxSliderValue, onChange, currency, setValue, tonPrice]);

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
            {children}

            <div className='flex items-center justify-between'>
              <span>{t('you_deposit')}</span>

              <button type='button' onClick={handleMaxButtonClick} className='custom-card-link'>
                {t('use_max')}
              </button>
            </div>

            <div className='flex max-w-full items-center text-ellipsis whitespace-pre text-xl font-bold'>
              <label
                data-currency-prefix={currency === Currency.USD ? '$\u00A0' : ''}
                data-currency-suffix={
                  currency === Currency.USD ? '' : `\u00A0${currency}${numberInputPostfix}`
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

          {error && <span className='text-sm text-red-500'>{error}</span>}

          <div className='relative h-12 w-full touch-none'>
            <input
              type='range'
              min='0'
              max={maxSliderValue.toString()}
              step={SLIDER_STEP}
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
