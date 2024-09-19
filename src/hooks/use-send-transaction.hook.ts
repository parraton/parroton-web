import { Address } from '@ton/core';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback } from 'react';

import { Message } from '../types/message.type';
import { bocToHash } from '@utils/boc.utils';

export const useSendTransaction = () => {
  const [tonConnectUI] = useTonConnectUI();

  return useCallback(
    (senderAddress: Address, messages: Message[]) => {
      const senderRawAddress = senderAddress.toRawString();

      return tonConnectUI
        .sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 1 * 60,
          from: senderRawAddress,
          messages,
        }) // TODO: implement status tracking
        .then((response) => ({
          senderRawAddress,
          bocHash: bocToHash(response.boc),
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tonConnectUI?.sendTransaction],
  );
};
