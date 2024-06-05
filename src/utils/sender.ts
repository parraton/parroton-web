import {Address, beginCell, Sender as ISender, SenderArguments, storeStateInit} from '@ton/core';
import {ITonConnect} from "@tonconnect/ui";
import {filter, interval, map, Subject, takeUntil} from "rxjs";
import TonWeb from "tonweb";
import {TonApiTransaction} from "@utils/types";

const DEFAULT_TTL = 5 * 60 * 1000;

export enum TransactionStatus {
  Pending,
  Success,
  Error,

  Hash = 3
}

type TXHash = string;
type BOC = string;

interface ITransactionPending {
  status: TransactionStatus.Pending;
  data: BOC;
}


interface ITransactionSuccess {
  status: TransactionStatus.Success;
  data: TXHash;
}

interface ITransactionError {
  status: TransactionStatus.Error;
  data: Error;
}

interface ITransactionHash {
  status: TransactionStatus.Hash;
  data: TXHash;

}

type Transaction = ITransactionPending | ITransactionSuccess | ITransactionError | ITransactionHash;

export const transactionSubject = new Subject<Transaction>();

export const pendingTransaction = transactionSubject.pipe(
  filter((x) => x.status === TransactionStatus.Pending),
  map((x) => x.data as BOC),
);

export const hashTransaction = transactionSubject.pipe(
  filter((x) => x.status === TransactionStatus.Hash),
  map((x) => x.data as TXHash),
);

const createUrl = (hash: TXHash) => {
  return process.env.NEXT_PUBLIC_TONAPI_URL + '/v2/events/' + hash;
}

pendingTransaction.subscribe(async (boc) => {
  console.log('Pending transaction', {boc})

  const hash = await bocToHash(boc);

  transactionSubject.next({
    status: TransactionStatus.Hash,
    data: hash,
  });


  interval(3000).pipe(
    takeUntil(successTransaction),
    takeUntil(errorTransaction),
    map(async () => {
      const url = createUrl(hash);

      const response = await fetch(url);

      if (!response.ok) {
        return false;
      }

      const {in_progress} = await response.json() as TonApiTransaction;

      console.log({in_progress})

      return in_progress != undefined && !in_progress;
    })
  ).subscribe(async (isMined) => {
    if (await isMined) {
      transactionSubject.next({
        status: TransactionStatus.Success,
        data: hash,
      });
      console.log('Transaction mined')
    } else {
      console.log('Transaction not mined')
    }
  })
})

export const successTransaction = transactionSubject.pipe(
  filter((x) => x.status === TransactionStatus.Success),
  map((x) => x.data as TXHash),
);


export const errorTransaction = transactionSubject.pipe(
  filter((x) => x.status === TransactionStatus.Error),
  map((x) => x.data as Error),
);

const bocToHash = async (boc: BOC): Promise<TXHash> => {
  const bocCell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(boc));

  return TonWeb.utils.bytesToBase64(await bocCell.hash());
}

export class Sender implements ISender {
  get address(): Address | undefined {
    return this.ton.account ? Address.parse(this.ton.account.address) : undefined;
  }

  constructor(
    private readonly ton: ITonConnect,
    private readonly ttl: number = DEFAULT_TTL,
  ) {
  }

  async send(args: SenderArguments): Promise<void> {
    const {boc} = await this.ton.sendTransaction({
      validUntil: Date.now() + this.ttl,
      messages: [
        {
          address: args.to.toString(),
          amount: args.value.toString(10),
          stateInit: args.init
            ? beginCell()
              .storeWritable(storeStateInit(args.init))
              .endCell()
              .toBoc()
              .toString('base64')
            : undefined,
          payload: args.body?.toBoc().toString('base64'),
        },
      ],
    });

    // const boc = 'tte6cckECBAEAAQwAAeGIAWzpMgvKSpGSbc02Up7W9m7XcpmjjKtJF830bi9mhAdUBx2h6YbTLwQ7lHnwDsUSU0WPCR1NEW8QGweSp6IYBabVkO8WEnnPom/elt3oWXhRIiH5ESAMKNyiZP5D6YJ/oFlNTRi7Ms1ncAAAADAAHAEBaGIANnwlsL6mfVLsowuYIWH2NI7tiSsDJJy3P8xZJlAsrEMgL68IAAAAAAAAAAAAAAAAAAECAbAPin6lAAAAAAAAAABB3NZQCADeuU8hs8GiklyygfF8GU6RsmbZsJHxzkQnMU/2DNsWlwAb1ynkNng0UkuWUD4vgynSNkzbNhI+OciE5in+wZti0sgF9eEBAwAIldudOTdsMWo='

    console.log('Transaction BOC:', boc);

    transactionSubject.next({
      status: TransactionStatus.Pending,
      data: boc,
    });
    //Observable that get boc and looking for transaction

  }
}