import { filter, interval, map, Subject, takeUntil } from 'rxjs';
import TonWeb from 'tonweb';
import { TransactionStatus } from '@types';
import { tonApiHttpClient } from '@core/tonapi';

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

pendingTransaction.subscribe(async (boc) => {
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
        // TODO: implement transaction failure handling
        try {
          const { in_progress } = await tonApiHttpClient.events.getEvent(hash);

          return in_progress != undefined && !in_progress;
        } catch (error) {
          console.error(error);

          return false;
        }
      }),
    )
    .subscribe(async (minePromise) => {
      if (await minePromise) {
        transactionSubject.next({
          status: TransactionStatus.Success,
          data: hash,
        });
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
