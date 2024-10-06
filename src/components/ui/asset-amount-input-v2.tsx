import { GlassCard } from '@components/glass-card';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { useTonPrice } from '@hooks/use-ton-price';
import { useTranslation } from '@i18n/client';
import { FALLBACK_TON_PRICE } from '@lib/constants';
import { cn } from '@lib/utils';
import { Currency } from '@types';
import BigNumber from 'bignumber.js';
import {
  FC,
  HTMLProps,
  RefCallback,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactSlider, { ReactSliderProps } from 'react-slider';

interface HTMLPropsWithRefCallback<T> extends HTMLProps<T> {
  ref: RefCallback<T>;
}

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
const SLIDER_STEP = new BigNumber(10).pow(-DECIMAL_PLACES).toNumber();

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
  const prevValueRef = useRef(value);
  const prevCurrencyRef = useRef(currency);
  const maxSliderValue = useMemo(
    () =>
      new BigNumber(maxValueTon)
        .times(currency === Currency.USD ? tonPrice : 1)
        .decimalPlaces(DECIMAL_PLACES, BigNumber.ROUND_FLOOR),
    [currency, maxValueTon, tonPrice],
  );
  const prevMaxSliderValueRef = useRef(maxSliderValue);
  const [numberInputValue, setNumberInputValue] = useState(value);

  const setValue = useCallback(
    (newValue: BigNumber) => {
      setNumberInputValue(newValue.toString());
      onChange(newValue.toString());
    },
    [onChange],
  );

  useEffect(() => {
    const prevMaxSliderValue = prevMaxSliderValueRef.current;
    if (prevValueRef.current !== value) {
      setValue(new BigNumber(value).decimalPlaces(DECIMAL_PLACES, BigNumber.ROUND_FLOOR));
    } else if (prevCurrencyRef.current !== currency) {
      const unroundedValue =
        currency === Currency.USD
          ? new BigNumber(value).times(tonPrice)
          : new BigNumber(value).div(tonPrice);
      setValue(unroundedValue.decimalPlaces(DECIMAL_PLACES, BigNumber.ROUND_FLOOR));
    } else if (!prevMaxSliderValue.eq(maxSliderValue) && maxSliderValue.lt(value)) {
      setValue(maxSliderValue);
    }
    prevValueRef.current = value;
    prevCurrencyRef.current = currency;
    prevMaxSliderValueRef.current = maxSliderValue;
  }, [value, maxSliderValue, onChange, currency, setValue, tonPrice]);

  const handleSliderChange = useCallback(
    (newValue: number) => setValue(new BigNumber(newValue).decimalPlaces(DECIMAL_PLACES)),
    [setValue],
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

            {error && <span className='text-sm text-red-500'>{error}</span>}
          </div>

          <StyledSlider
            renderTrack={StyledTrack}
            renderThumb={StyledThumb}
            min={0}
            max={maxSliderValue.toNumber()}
            step={SLIDER_STEP}
            value={BigNumber.min(maxSliderValue, value).toNumber()}
            onChange={handleSliderChange}
          />
        </div>
      </GlassCard>
    </div>
  );
};

const StyledSlider = (props: ReactSliderProps) => (
  <ReactSlider {...props} className={cn(props.className, 'h-12 w-full bg-secondary')} />
);

const StyledThumb = ({
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  children: _,
  className,
  key,
  ...restProps
}: HTMLPropsWithRefCallback<HTMLDivElement>) => (
  <div
    {...restProps}
    className={cn(
      className,
      'flex h-12 w-12 cursor-grab items-center justify-between bg-primary-foreground px-4',
    )}
    key={key}
  >
    {[0.32, 0.72, 1].map((opacity) => (
      <div
        key={opacity}
        className='h-4 w-0.5 rounded-lg bg-custom-primary-text'
        style={{ opacity }}
      />
    ))}
  </div>
);

interface TrackState {
  index: number;
  value: number;
}

const StyledTrack = (
  { className, key, ...restProps }: HTMLPropsWithRefCallback<HTMLDivElement>,
  { index }: TrackState,
) => (
  <div
    {...restProps}
    className={cn(
      className,
      'bottom-0 top-0',
      index === 0 ? 'bg-primary-foreground' : 'bg-secondary',
    )}
    key={key}
  />
);
