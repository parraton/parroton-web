'use client';

import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import { Sender } from '@utils/sender';
import { Address } from '@ton/core';

interface ConnectionOptions {
  batch?: boolean;
}

export function useConnection({ batch }: ConnectionOptions = {}): {
  sender: Sender;
  connected: boolean;
  address?: Address;
} {
  const [TonConnectUI] = useTonConnectUI();
  const [connected, setConnected] = useState(false);
  const rawAddress = TonConnectUI?.connector.wallet?.account.address;

  useEffect(() => {
    setConnected(Boolean(TonConnectUI?.connector.wallet?.provider));

    TonConnectUI.connectionRestored.then((value) => {
      setConnected(value);
    });

    TonConnectUI.onStatusChange((wallet) => {
      const isConnected = wallet?.provider;
      setConnected(Boolean(isConnected));
    });
  }, [TonConnectUI]);

  return {
    sender: new Sender(TonConnectUI, batch),
    connected,
    address: rawAddress ? Address.parse(rawAddress) : undefined,
  };
}
