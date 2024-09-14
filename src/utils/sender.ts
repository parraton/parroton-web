/* eslint-disable no-unused-vars */

import {
  Address,
  beginCell,
  Sender as ISender,
  SenderArguments,
  StateInit,
  storeStateInit,
} from '@ton/core';
import { ITonConnect, SendTransactionResponse, TonConnectUI } from '@tonconnect/ui';
import { SendTransactionRequest } from '@tonconnect/sdk';
import { transactionSubject } from '@utils/transaction-subjects';
import { Maybe, TransactionStatus } from '@types';
import { Subject } from 'rxjs';

const DEFAULT_TTL = 5 * 60 * 1000;

export const transactionModalSubject = new Subject<void>();

const argsInitToMessageStateInit = (init: Maybe<StateInit>) =>
  init
    ? beginCell().storeWritable(storeStateInit(init)).endCell().toBoc().toString('base64')
    : undefined;

const argsToMessage = (args: SenderArguments) => ({
  address: args.to.toString(),
  amount: args.value.toString(10),
  stateInit: argsInitToMessageStateInit(args.init),
  payload: args.body?.toBoc().toString('base64'),
});

export class Sender implements ISender {
  private messages: SendTransactionRequest['messages'] = [];

  get address(): Address | undefined {
    return this.ton?.account ? Address.parse(this.ton.account.address) : undefined;
  }

  constructor(
    private readonly ton: ITonConnect | TonConnectUI,
    private readonly batch: boolean = false,
    private readonly ttl: number = DEFAULT_TTL,
  ) {}

  private async sendTonTransaction(args: SendTransactionRequest): Promise<SendTransactionResponse> {
    transactionModalSubject.next();
    const { boc } = await this.ton.sendTransaction(args);

    return { boc };
  }

  private async sendTransaction(args: SenderArguments) {
    const { boc } = await this.sendTonTransaction({
      validUntil: Date.now() + this.ttl,
      messages: [argsToMessage(args)],
    });

    transactionSubject.next({
      status: TransactionStatus.Pending,
      data: boc,
    });
  }

  private saveTransactionMessage(args: SenderArguments) {
    this.messages.push(argsToMessage(args));
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
      const { boc } = await this.sendTonTransaction({
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
