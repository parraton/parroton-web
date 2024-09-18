'use client';

import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
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
  const walletAddress = useTonAddress();

  const [connected, setConnected] = useState(false);

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
    address: walletAddress !== '' ? Address.parse(walletAddress) : undefined,
  };
}
