import {getSharesWallet, getVault, SharesWallet} from "@core";
import {useConnection} from "@hooks/use-connection";
import useSWR from "swr";
import {Address, fromNano} from "@ton/core";

const getSharesBalance = async (senderAddress: Address) => {
  const vault = await getVault();
  const sharesWallet = await getSharesWallet(vault, senderAddress);
  const data = await sharesWallet.getWalletData();

  //TODO: fix decimals
  return fromNano(data.balance);
}

export const useSharesBalance = () => {
  const {sender} = useConnection();

  const {data, error} = useSWR(['lpBalance'], async () => {
    if (!sender.address) return null;

    return await getSharesBalance(sender.address);
  }, {refreshInterval: 5_000});

  return {
    balance: data,
    error,
  };
}