import { Address } from '@ton/core';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback } from 'react';

import { TransactionInfo } from '../types/transaction-info.interface';
import { Message } from '../types/message.type';
import { bocToHash } from '@utils/boc.utils';

export const useSendTransaction = () => {
  const [tonConnectUI] = useTonConnectUI();
  //   const [isOpen, setIsOpen] = useState(false);

  return useCallback(
    (senderAddress: Address, messages: Message[]) => {
      //   setIsOpen(true);
      const senderRawAddress = senderAddress.toRawString();
      console.log('senderRawAddress', senderRawAddress);

      console.log('messages', messages);
      return tonConnectUI
        .sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 1 * 60,
          from: senderRawAddress,
          messages,
        })
        .then(
          (response): TransactionInfo => ({
            senderRawAddress,
            bocHash: bocToHash(response.boc),
          }),
        )
        .catch(() => {
          //   showErrorToast('Transaction cancelled, try again...');

          return;
        })
        .finally(() => {
          //   setIsOpen(false);
          return;
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tonConnectUI?.sendTransaction],
  );
};
