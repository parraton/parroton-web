import { deposit as depositApi, getVault, getWalletAddress } from '@core';
import { Address, toNano } from '@ton/core';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { usePool } from '@hooks/use-pool';
import { useTonAddress } from '@tonconnect/ui-react';
import { isAddressDefined } from '@utils/is-address-defined';
import { useSendTransaction } from './use-send-transaction.hook';

export const useDeposit = () => {
  const walletAddress = useTonAddress();
  const sendTransaction = useSendTransaction();
  const { vault: vaultAddress } = useParams(VaultPage);

  const { pool } = usePool(vaultAddress);

  const deposit = async (amount: string | number) => {
    if (!isAddressDefined(walletAddress) || !pool) {
      return;
    }

    const vault = await getVault(Address.parse(vaultAddress));
    const investorLpWalletAddress = await getWalletAddress(Address.parse(walletAddress), pool);

    const atomicAmount = toNano(amount);

    const referral = localStorage.getItem('ref');

    const depositMessage = depositApi(investorLpWalletAddress, vault, atomicAmount, referral);

    await sendTransaction(Address.parse(walletAddress), [depositMessage]);

    return sendTransaction;
  };

  return { deposit };
};
