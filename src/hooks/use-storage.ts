import { useCloudStorage } from '@vkruglikov/react-telegram-web-app';

export function useStorage() {
  const {
    getItem: getItemOriginal,
    setItem: setItemOriginal,
    getItems: getItemsOriginal,
    getKeys: getKeysOriginal,
    removeItem: removeItemOriginal,
  } = useCloudStorage();

  const getItem = async (key: string) => {
    try {
      return await getItemOriginal(key);
    } catch (error) {
      if (error instanceof Error && error.message === 'WebAppMethodUnsupported') {
        return localStorage.getItem(key) ?? '';
      }
    }
  };

  const setItem = async (key: string, value: string) => {
    try {
      await setItemOriginal(key, value);
    } catch (error) {
      if (error instanceof Error && error.message === 'WebAppMethodUnsupported') {
        localStorage.setItem(key, value);
      }
    }
  };

  const getItems = async (keys: string[]) => {
    try {
      return await getItemsOriginal(keys);
    } catch (error) {
      if (error instanceof Error && error.message === 'WebAppMethodUnsupported') {
        return keys.reduce(
          (acc, key) => {
            acc[key] = localStorage.getItem(key) ?? '';
            return acc;
          },
          {} as Record<string, string>,
        );
      }
    }
  };

  const getKeys = async () => {
    try {
      return await getKeysOriginal();
    } catch (error) {
      if (error instanceof Error && error.message === 'WebAppMethodUnsupported') {
        return Object.keys(localStorage);
      }
    }
  };

  const removeItem = async (key: string) => {
    try {
      await removeItemOriginal(key);
    } catch (error) {
      if (error instanceof Error && error.message === 'WebAppMethodUnsupported') {
        localStorage.removeItem(key);
      }
    }
  };

  return {
    getItem,
    setItem,
    getItems,
    getKeys,
    removeItem,
  };
}
