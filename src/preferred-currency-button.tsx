'use client';

import { GlassCard } from '@components/glass-card';
import { CheckIcon } from '@components/icons/check-icon';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { useTranslation } from '@i18n/client';
import { Currency } from '@types';
import { Button } from '@UI/button';
import { ChevronDownIcon } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

export const PreferredCurrencyButton = () => {
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const { preferredCurrency, updatePreferredCurrency } = usePreferredCurrency();
  const rootRef = useRef<HTMLDivElement>(null);

  const toggleDropdownIsOpen = useCallback(() => setDropdownIsOpen((prev) => !prev), []);
  const handleOptionClick = useCallback(
    (currency: Currency) => {
      updatePreferredCurrency(currency);
      setDropdownIsOpen(false);
    },
    [updatePreferredCurrency],
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (rootRef.current?.contains(e.relatedTarget as Node)) return;

    setDropdownIsOpen(false);
  }, []);

  return (
    <div className='relative' ref={rootRef}>
      <button
        className='custom-preferred-currency-button'
        type='button'
        onBlur={handleBlur}
        onClick={toggleDropdownIsOpen}
      >
        <CurrencyLabel currency={preferredCurrency} />

        <ChevronDownIcon size={20} />
      </button>

      {dropdownIsOpen && (
        <GlassCard className='absolute right-0 top-full mt-2 overflow-hidden'>
          {Object.values(Currency).map((currency) => (
            <CurrencyOption
              value={currency}
              isSelected={currency === preferredCurrency}
              key={currency}
              onClick={handleOptionClick}
            />
          ))}
        </GlassCard>
      )}
    </div>
  );
};

interface CurrencyOptionProps {
  value: Currency;
  isSelected: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick: (currency: Currency) => void;
}

const CurrencyOption = ({ value, isSelected, onClick }: CurrencyOptionProps) => {
  const handleClick = useCallback(() => onClick(value), [onClick, value]);

  return (
    <Button
      className='flex w-32 items-center justify-between hover:bg-switcher'
      variant='ghost'
      onClick={handleClick}
    >
      <CurrencyLabel currency={value} />

      {isSelected && <CheckIcon className='size-4 fill-current text-custom-link' />}
    </Button>
  );
};

interface CurrencyLabelProps {
  currency: Currency;
}

export const CurrencyLabel = ({ currency }: CurrencyLabelProps) => {
  const { t } = useTranslation({ ns: 'common' });

  return currency === Currency.USD ? 'USD' : t('tokens');
};
