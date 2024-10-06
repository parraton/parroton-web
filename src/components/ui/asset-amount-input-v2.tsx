import { GlassCard } from '@components/glass-card';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { useTranslation } from '@i18n/client';
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
  maxValueInAsset: string;
  assetSymbol: string;
  assetExchangeRate: BigNumber.Value;
  assetDecimalPlaces?: number;
  shouldShowActualAssetPostfix: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}

export const AssetAmountInputV2: FC<AssetAmountInputV2Props> = ({
  children,
  value,
  error,
  maxValueInAsset,
  assetSymbol,
  assetExchangeRate,
  assetDecimalPlaces = 9,
  shouldShowActualAssetPostfix,
  onChange,
}) => {
  const { t } = useTranslation({ ns: 'vault-card' });

  const { preferredCurrency: currency } = usePreferredCurrency();
  const decimalPlaces = currency === Currency.USD ? 2 : assetDecimalPlaces;
  const sliderStep = useMemo(
    () => new BigNumber(10).pow(-decimalPlaces).toNumber(),
    [decimalPlaces],
  );

  const toProperDecimalPlacesValue = useCallback(
    (value: BigNumber) => value.decimalPlaces(decimalPlaces, BigNumber.ROUND_FLOOR).toString(),
    [decimalPlaces],
  );

  const prevValueRef = useRef(value);
  const prevCurrencyRef = useRef(currency);
  const maxSliderValue = useMemo(
    () =>
      new BigNumber(maxValueInAsset)
        .times(currency === Currency.USD ? assetExchangeRate : 1)
        .decimalPlaces(decimalPlaces, BigNumber.ROUND_FLOOR),
    [assetExchangeRate, currency, decimalPlaces, maxValueInAsset],
  );
  const prevMaxSliderValueRef = useRef(maxSliderValue);
  const [numberInputValue, setNumberInputValue] = useState(() =>
    toProperDecimalPlacesValue(new BigNumber(value)),
  );

  const setValue = useCallback(
    (newValue: BigNumber) => {
      const sanitizedNewValue = toProperDecimalPlacesValue(newValue);
      setNumberInputValue(sanitizedNewValue);
      onChange(sanitizedNewValue);
    },
    [onChange, toProperDecimalPlacesValue],
  );

  useEffect(() => {
    const prevMaxSliderValue = prevMaxSliderValueRef.current;
    if (prevValueRef.current !== value) {
      setValue(new BigNumber(value));
    } else if (prevCurrencyRef.current !== currency) {
      setValue(
        currency === Currency.USD
          ? new BigNumber(value).times(assetExchangeRate)
          : new BigNumber(value).div(assetExchangeRate),
      );
    } else if (!prevMaxSliderValue.eq(maxSliderValue) && maxSliderValue.lt(value)) {
      setValue(maxSliderValue);
    }
    prevValueRef.current = value;
    prevCurrencyRef.current = currency;
    prevMaxSliderValueRef.current = maxSliderValue;
  }, [value, maxSliderValue, onChange, currency, setValue, decimalPlaces, assetExchangeRate]);

  const handleSliderChange = useCallback(
    (newValue: number) => setValue(new BigNumber(newValue).decimalPlaces(decimalPlaces)),
    [decimalPlaces, setValue],
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
        decimalPlaces,
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
          : newRawValue.slice(0, decimalSeparatorIndex + decimalPlaces + 1),
      );
      onChange(newValue);
    },
    [decimalPlaces, onChange],
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
                  currency === Currency.USD
                    ? shouldShowActualAssetPostfix
                      ? t('actual_asset_postfix', {
                          tokenSymbol: assetSymbol,
                          interpolation: { escapeValue: false },
                        })
                      : ''
                    : `\u00A0${assetSymbol}`
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
            step={sliderStep}
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
      'flex h-12 w-12 cursor-grab items-center justify-between bg-custom-link px-4',
    )}
    key={key}
  >
    {[0.32, 0.72, 1].map((opacity) => (
      <div key={opacity} className='h-4 w-0.5 rounded-lg bg-[#74bec9]' style={{ opacity }} />
    ))}
  </div>
);

interface TrackState {
  index: number;
  value: number;
}

const StyledTrack = (
  { className, key, style: styleFromProps, ...restProps }: HTMLPropsWithRefCallback<HTMLDivElement>,
  { index }: TrackState,
) => {
  const leftFromProps = styleFromProps?.left;

  const style = {
    ...styleFromProps,
    left: leftFromProps && (index !== 0) ? (Number.parseInt(String(leftFromProps)) + 2) : leftFromProps,
  };

  return (
    <div
      {...restProps}
      style={style}
      className={cn(
        className,
        'bottom-0 top-0',
        index === 0 ? 'bg-custom-link' : 'bg-gray-300 dark:bg-gray-600',
      )}
      key={key}
    />
  );
};
