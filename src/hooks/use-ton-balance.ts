import { tonApiHttpClient } from '@core/tonapi';
import { Address, fromNano } from '@ton/core';
import { useTonAddress } from '@tonconnect/ui-react';
import useSWR from 'swr';

const getTonBalance = async ([, currentTonAddress]: [string, string]) => {
  if (!currentTonAddress) {
    return null;
  }

  const { balance } = await tonApiHttpClient.accounts.getAccount(
    Address.parse(currentTonAddress).toRawString(),
  );

  return fromNano(balance);
};

export const useTonBalance = () => {
  const tonAddress = useTonAddress();

  const { data, error } = useSWR(['ton-balance', tonAddress], getTonBalance, {
    refreshInterval: 10_000,
    suspense: false,
    shouldRetryOnError: true,
  });

  return {
    balance: data,
    error,
  };
};
