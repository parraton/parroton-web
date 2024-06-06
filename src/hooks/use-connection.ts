'use client';

import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import { Sender } from '@utils/sender';

export interface ConnectionOptions {
  batch?: boolean;
}

export function useConnection({ batch }: ConnectionOptions = {}): {
  sender: Sender;
  connected: boolean;
} {
  const [TonConnectUI] = useTonConnectUI();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    TonConnectUI.connectionRestored.then((value) => {
      setConnected(value);
    });

    return TonConnectUI.onStatusChange((wallet) => {
      const isConnected = wallet?.provider;

      setConnected(Boolean(isConnected));
    });
  }, [TonConnectUI]);

  return {
    sender: new Sender(TonConnectUI?.connector, batch),
    connected,
  };
}
