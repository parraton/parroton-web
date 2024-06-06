import { Address, beginCell, Sender as ISender, SenderArguments, storeStateInit } from '@ton/core';
import { ITonConnect } from '@tonconnect/ui';
import { SendTransactionRequest } from '@tonconnect/sdk';
import { TransactionStatus, transactionSubject } from '@utils/transaction-subjects';

const DEFAULT_TTL = 5 * 60 * 1000;

export class Sender implements ISender {
  private messages: SendTransactionRequest['messages'] = [];

  get address(): Address | undefined {
    return this.ton.account ? Address.parse(this.ton.account.address) : undefined;
  }

  constructor(
    private readonly ton: ITonConnect,
    private readonly batch: boolean = false,
    private readonly ttl: number = DEFAULT_TTL,
  ) {}

  private async sendTransaction(args: SenderArguments) {
    const { boc } = await this.ton.sendTransaction({
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

    transactionSubject.next({
      status: TransactionStatus.Pending,
      data: boc,
    });
  }

  private saveTransactionMessage(args: SenderArguments) {
    this.messages.push({
      address: args.to.toString(),
      amount: args.value.toString(10),
      stateInit: args.init
        ? beginCell().storeWritable(storeStateInit(args.init)).endCell().toBoc().toString('base64')
        : undefined,
      payload: args.body?.toBoc().toString('base64'),
    });
  }

  async send(args: SenderArguments): Promise<void> {
    if (this.batch) {
      this.saveTransactionMessage(args);
    } else {
      await this.sendTransaction(args);
    }
  }

  async sendBatch(): Promise<void> {
    if (this.batch) {
      console.log('Sending batch', this.messages);

      const { boc } = await this.ton.sendTransaction({
        validUntil: Date.now() + this.ttl,
        messages: this.messages.toReversed(),
      });

      this.messages = [];

      transactionSubject.next({
        status: TransactionStatus.Pending,
        data: boc,
      });
    } else {
      throw new Error('Batch mode is disabled');
    }
  }
}
