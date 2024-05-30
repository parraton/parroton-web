import {useConnection} from '@hooks/use-connection';
import {Address, fromNano} from '@ton/core';
import useSWR from "swr";
import {getLpWallet} from "@core";
import {formatCurrency} from "@lib/utils";

const getLpBalance = async (senderAddress: Address) => {
  const lpWallet = await getLpWallet(senderAddress);
  const data = await lpWallet.getWalletData();

//TODO: fix decimals
  return fromNano(data.balance);
};

export const useLpBalance = () => {
  const {sender} = useConnection();


  const {data, error} = useSWR(['lpBalance'], async () => {
    if (!sender.address) return null;

    return await getLpBalance(sender.address);
  }, {refreshInterval: 5_000});

  return {
    balance: data,
    error,
  };
};
