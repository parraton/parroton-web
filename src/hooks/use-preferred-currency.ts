import useSWR from 'swr';
import { useStorage } from './use-storage';
import { useCallback } from 'react';
import { Currency } from '@types';

const storageKey = 'preferredCurrency';

export const usePreferredCurrency = () => {
  const { getItem, setItem } = useStorage();

  const getPreferredCurrency = useCallback(async () => {
    const rawValue = await getItem(storageKey);

    return Object.values(Currency).includes(rawValue as Currency)
      ? (rawValue as Currency)
      : Currency.USD;
  }, [getItem]);
  const { data: preferredCurrency = Currency.USD, mutate } = useSWR(
    storageKey,
    getPreferredCurrency,
    {
      suspense: false,
      shouldRetryOnError: true,
    },
  );

  const updatePreferredCurrency = useCallback(
    async (currency: Currency) => {
      await setItem(storageKey, currency);
      mutate(currency);
    },
    [mutate, setItem],
  );

  return { preferredCurrency, updatePreferredCurrency };
};
