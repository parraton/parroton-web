interface Resources {
  common: {
    app_title: 'Parroton';
    app_description: 'Description for Parroton';
    submit: 'Submit';
    amount: 'Amount';
    deposit: 'Deposit';
    withdraw: 'Withdraw';
    rewards: 'Claim Rewards';
  };
  demo: {
    button_text: 'Click me';
    sonner_button_text: 'Click me too';
    sonner_massage: "Hello, I'm a sonner, message: {{message}}";
    sonner_undo: 'Undo';
    sonner_description: 'This is a sonner button, date: {{date}}';
  };
  form: {
    deposit_title: 'Deposit';
    deposit_description: 'Deposit your lp and get rewards';
    withdraw_title: 'Withdraw';
    withdraw_description: 'Withdraw your lp and rewards';
    faucet_title: 'Faucet';
    faucet_description: 'Get some free tokens';
    claim_title: 'Claim';
    claim_description: 'Claim your rewards';
    validation: {
      min_deposit: 'Deposit can not be less or equal {{minDeposit}}';
      max_deposit: 'Deposit can not be more than {{maxDeposit}}';
      min_withdraw: 'Withdraw can not be less or equal {{minWithdraw}}';
      max_withdraw: 'Withdraw can not be more than {{maxWithdraw}}';
    };
  };
  language: {
    en: 'English';
    ua: 'Українська';
    sr_only_text: 'Change language';
  };
  mode: {
    toggle_mode_text: 'Toggle Mode';
    toggle_mode: {
      light: 'Light';
      dark: 'Dark';
      system: 'System';
    };
  };
  settings: {
    dialog_title: 'Settings';
    dialog_description: 'Here you can change the settings of the application.';
    dialog_close: 'Close';
    mode_title: 'Color mode';
    language_title: 'Language';
  };
  'vault-card': {
    balance: 'Wallet';
    deposited: 'Deposited';
    apy: 'APY';
    daily: 'Daily';
    tvl: 'TVL';
    manage: 'Manage Vault';
  };
}

export default Resources;
