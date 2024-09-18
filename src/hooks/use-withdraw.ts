import { getVault, getWalletAddress, withdraw as withdrawApi } from '@core';
import { Address, toNano } from '@ton/core';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useSendTransaction } from './use-send-transaction.hook';
import { useTonAddress } from '@tonconnect/ui-react';

export const useWithdraw = () => {
  const walletAddress = useTonAddress();
  const sendTransaction = useSendTransaction();
  const { vault: vaultAddress } = useParams(VaultPage);

  const withdraw = async (amount: string | number) => {
    if (!walletAddress) {
      return;
    }

    const vault = await getVault(Address.parse(vaultAddress));
    const address = Address.parse(walletAddress);
    const sharesWalletAddress = await getWalletAddress(address, vault.address);

    const atomicAmount = toNano(amount);

    const withdrawMessage = withdrawApi(sharesWalletAddress, address, atomicAmount);

    await sendTransaction(Address.parse(walletAddress), [withdrawMessage]);
  };

  return { withdraw };
};
