'use client';

import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address, Sender, SenderArguments } from '@ton/core';
import { useEffect, useState } from 'react';

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
    sender: {
      send: async (args: SenderArguments) => {
        await TonConnectUI?.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 6 * 60 * 1000,
        });
      },
      address: TonConnectUI?.account?.address
        ? Address.parse(TonConnectUI.account.address)
        : undefined,
    },
    connected,
  };
}
