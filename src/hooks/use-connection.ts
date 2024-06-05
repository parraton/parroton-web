'use client';

import {useTonConnectUI} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react';
import {Sender} from "@utils/sender";

export function useConnection(): { sender: Sender; connected: boolean } {
  const [TonConnectUI] = useTonConnectUI();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    return TonConnectUI.onStatusChange((wallet) => {
      const isConnected = wallet?.provider;

      setConnected(Boolean(isConnected));
    });
  }, [TonConnectUI]);
  
  return {
    sender: new Sender(TonConnectUI.connector),
    connected,
  };
}
