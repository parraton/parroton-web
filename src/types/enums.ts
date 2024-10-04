/* eslint-disable no-unused-vars */

export enum Actions {
  depositOrWithdraw = 'deposit_or_withdraw',
  faucet = 'faucet',
  claim = 'claim',
}

export enum TransactionStatus {
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
  Hash = 'hash',
}

export enum Currency {
  USD = 'USD',
  TON = 'TON',
}
