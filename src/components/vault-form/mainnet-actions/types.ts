export type MainnetAction = 'deposit' | 'withdraw';

export interface MainnetActionsFormValues {
  amount: string;
  action: MainnetAction;
}
