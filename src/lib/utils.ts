import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Language } from '@i18n/settings';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const languageToIntlLocaleMap: Record<Language, Intl.LocalesArgument> = {
  en: 'en-US',
  ua: 'uk-UA',
};

export const formatNumber = (num: number | string | undefined | null, locale: Language = 'en') => {
  if (num === undefined || num === null) return '~~~~';

  return new Intl.NumberFormat(languageToIntlLocaleMap[locale], {
    minimumFractionDigits: 2,
  }).format(Number(num));
};

export const formatCurrency = (
  num: number | string,
  locale: Language = 'en',
  currency: string = 'USD',
) => {
  const argument = Number.parseFloat(num as string);

  return new Intl.NumberFormat(languageToIntlLocaleMap[locale], {
    style: 'currency',
    notation: argument > 1_000_000 ? 'compact' : 'standard',
    currency: currency,
  }).format(argument);
};

export const formatPercentage = (num: number | string, locale: Language = 'en') => {
  const argument = Number(num as string) / 100;

  return new Intl.NumberFormat(languageToIntlLocaleMap[locale], {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(argument);
};
