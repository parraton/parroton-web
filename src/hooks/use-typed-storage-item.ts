import { useCallback, useMemo } from 'react';
import { useStorage } from './use-storage';
import useSWR from 'swr';

export const useTypedStorageItem = <T>(
  storageKey: string,
  defaultValue: T,
  typeguard: (value: unknown) => value is T,
) => {
  const { getItem, setItem } = useStorage();

  const serializedDefaultValue = useMemo(() => JSON.stringify(defaultValue), [defaultValue]);

  const getValue = useCallback(async () => {
    try {
      const maybeValue = JSON.parse((await getItem(storageKey)) || serializedDefaultValue);

      if (typeguard(maybeValue)) {
        return maybeValue;
      }

      throw new Error('Invalid data');
    } catch {
      setItem(storageKey, JSON.stringify(defaultValue)).catch(console.error);

      return defaultValue;
    }
  }, [defaultValue, getItem, storageKey, serializedDefaultValue, setItem, typeguard]);
  const { data: value, mutate } = useSWR(`typed-storage-item-${storageKey}`, getValue, {
    suspense: false,
    shouldRetryOnError: true,
  });

  const setValue = useCallback(
    async (value: T) => {
      await setItem(storageKey, JSON.stringify(value));
      await mutate(value);
    },
    [storageKey, mutate, setItem],
  );

  return { value, setValue };
};
