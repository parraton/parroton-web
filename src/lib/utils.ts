import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Language } from '@i18n/settings';
import BigNumber from 'bignumber.js';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const languageToIntlLocaleMap: Record<Language, Intl.LocalesArgument> = {
  en: 'en-US',
  ua: 'uk-UA',
};

const getDecimalsSeparator = (locale: Language) =>
  Intl.NumberFormat(languageToIntlLocaleMap[locale]).formatToParts(0.1)[1].value;

export const formatNumber = (num: number | string | undefined | null, locale: Language = 'en') => {
  if (num === undefined || num === null) return '~~~~';

  const parsedValue = new BigNumber(typeof num === 'string' ? num.replace(',', '.') : num);
  // eslint-disable-next-line unicorn/require-number-to-fixed-digits-argument
  let result = parsedValue.toFixed();
  if (parsedValue.decimalPlaces() === 0) {
    result += '.';
  }
  result += '0'.repeat(Math.max(0, 2 - (parsedValue.decimalPlaces() ?? 0)));

  return result.replace('.', getDecimalsSeparator(locale));
};

export const formatNumberWithDigitsLimit = (
  input: string,
  locale: Language = 'en',
  digitsLimit = 7,
) => {
  const parsedBalance = new BigNumber(input);
  let result: string;

  if (parsedBalance.gte(10 ** (digitsLimit - 1))) {
    result = parsedBalance.integerValue(BigNumber.ROUND_FLOOR).toString();
  } else if (parsedBalance.gte(1)) {
    // Leave 7 significant digits
    const exponent = parsedBalance.e ?? 0;

    result = parsedBalance
      .shiftedBy(-exponent)
      .decimalPlaces(digitsLimit - 1, BigNumber.ROUND_FLOOR)
      .shiftedBy(exponent)
      .toString();
  } else if (parsedBalance.lte(10 ** (-digitsLimit + 1)) && parsedBalance.gt(0)) {
    result = `< ${formatNumber(10 ** (-digitsLimit + 1), locale)}`;
  } else {
    result = parsedBalance.decimalPlaces(digitsLimit - 1, BigNumber.ROUND_FLOOR).toString();
  }

  return result.replace('.', getDecimalsSeparator(locale));
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

export const isMainnet = process.env.NETWORK === 'mainnet';

interface AmountValidationMessages {
  required: string;
  invalidFormat: string;
  /* eslint-disable no-unused-vars */
  min: (minAmount: string | number) => string;
  max: (maxAmount: string | number) => string;
  /* eslint-enable no-unused-vars */
}

interface AmountValidationOptions {
  required: boolean;
  min?: string | number;
  max?: string | number;
}

export const getAmountAsStringValidationSchema = (
  messages: AmountValidationMessages,
  validationOptions: AmountValidationOptions,
) => {
  const {
    required: requiredMessage,
    invalidFormat: invalidFormatMessage,
    min: minMessageFn,
    max: maxMessageFn,
  } = messages;
  const { required, min, max } = validationOptions;

  return z.string().superRefine((value, ctx) => {
    if (!value) {
      if (required) {
        ctx.addIssue({ message: requiredMessage, code: z.ZodIssueCode.custom });
      }

      return;
    }

    const parsedValue = new BigNumber(value.replace(',', '.'));

    if (!parsedValue.isFinite()) {
      ctx.addIssue({ message: invalidFormatMessage, code: z.ZodIssueCode.custom });

      return;
    }

    if (min != null && parsedValue.lte(min)) {
      ctx.addIssue({
        message: minMessageFn(min),
        code: z.ZodIssueCode.custom,
      });

      return;
    }

    if (max != null && parsedValue.gt(max)) {
      ctx.addIssue({
        message: maxMessageFn(formatNumber(max)),
        code: z.ZodIssueCode.custom,
      });

      return;
    }
  });
};
