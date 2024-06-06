import { filter, interval, map, Subject, takeUntil } from 'rxjs';
import { TonApiTransaction } from '@utils/types';
import TonWeb from 'tonweb';

export enum TransactionStatus {
  Pending,
  Success,
  Error,

  Hash = 3,
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
};

pendingTransaction.subscribe(async (boc) => {
  console.log('Pending transaction', { boc });

  const hash = await bocToHash(boc);

  transactionSubject.next({
    status: TransactionStatus.Hash,
    data: hash,
  });

  interval(3000)
    .pipe(
      takeUntil(successTransaction),
      takeUntil(errorTransaction),
      map(async () => {
        const url = createUrl(hash);

        const response = await fetch(url);

        if (!response.ok) {
          return false;
        }

        const { in_progress } = (await response.json()) as TonApiTransaction;

        console.log({ in_progress });

        return in_progress != undefined && !in_progress;
      }),
    )
    .subscribe(async (isMined) => {
      if (await isMined) {
        transactionSubject.next({
          status: TransactionStatus.Success,
          data: hash,
        });
        console.log('Transaction mined');
      } else {
        console.log('Transaction not mined');
      }
    });
});

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

  return TonWeb.utils.bytesToHex(await bocCell.hash());
};
