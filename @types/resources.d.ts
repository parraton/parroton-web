/* eslint-disable prettier/prettier */
interface Resources {
  "common": {
    "app_title": "Parraton",
    "app_description": "Description for Parraton",
    "amount": "Amount",
    "deposit": "Deposit",
    "confirm_deposit": "Confirm Deposit",
    "connect_wallet_to_deposit": "Connect wallet to deposit",
    "withdraw": "Withdraw",
    "rewards": "Claim Rewards"
  },
  "form": {
    "deposit_title": "Deposit",
    "deposit_description": "Deposit your lp to automate rewards reinvestment.",
    "get_lp_description": "Not enough LP? Invest in DeDust pool",
    "withdraw_title": "Withdraw",
    "withdraw_description": "Burn your PLPs to get underlying LPs",
    "faucet_title": "Faucet",
    "faucet_description": "Get some free tokens to test our platform",
    "claim_title": "Claim",
    "claim_description": "Get extra rewards from our platform",
    "validation": {
      "required": "Field is required",
      "invalid_format": "Invalid format",
      "min_deposit": "Deposit can not be less or equal {{minDeposit}}",
      "max_deposit": "Deposit can not be more than {{maxDeposit}}",
      "min_withdraw": "Withdraw can not be less or equal {{minWithdraw}}",
      "max_withdraw": "Withdraw can not be more than {{maxWithdraw}}"
    },
    "claim": {
      "balance": "Your rewards",
      "button": "Claim"
    },
    "faucet": {
      "button": "Get DeDust LP"
    },
    "mint": {
      "button": "Mint Jettons"
    },
    "lp_output": "LPs to receive",
    "plp_output": "PLPs to receive",
    "max_label": "MAX"
  },
  "kpi": {
    "wanna_know_our_goals": "Wanna know our goals?",
    "our_kpi": "Our KPI",
    "reach_together": "Let’s reach them together",
    "goals": {
      "revenue": "{{revenue_goal}} Revenue",
      "tvl": "{{tvl_goal}} TVL",
      "shares": "{{share_goal}} of Dedust Lp"
    }
  },
  "language": {
    "en": "English",
    "ua": "Українська",
    "sr_only_text": "Change language"
  },
  "mode": {
    "toggle_mode_text": "Toggle Mode",
    "toggle_mode": {
      "light": "Light",
      "dark": "Dark",
      "system": "System"
    }
  },
  "settings": {
    "dialog_title": "Settings",
    "dialog_description": "Here you can manage the settings of the application",
    "dialog_close": "Close",
    "mode_title": "Color mode",
    "language_title": "Language",
    "referral_title": "Referral link for web",
    "referral_mini_app": "Referral link to miniapp",
    "copy_referral": "Copy"
  },
  "terms": {
    "header": "Accept Terms",
    "description": "By using this platform, you agree to our Terms of Use and Privacy Policy. The platform is not responsible for any losses incurred. Use at your own risk.",
    "accept": "I agree"
  },
  "transaction": {
    "failed": "Transaction Failed",
    "view_explorer": "View Explorer",
    "completed": "Transaction Completed"
  },
  "vault-card": {
    "balance": "Wallet",
    "deposited": "Your Deposit",
    "currency": "Currency",
    "apy": "APY",
    "daily": "Daily",
    "pending_reinvest": "Pending Reinvest",
    "reinvest_tooltip": "This is the total pending rewards for all users. The reinvest happens once per day if at least 7 TON are in pending rewards",
    "extraApr": "Extra APR",
    "tvl": "TVL"
  },
  "welcome": {
    "main": "We are on Testnet!",
    "description": "Ahoy, stranger! First time here? Learn how to use our platform in our short video guide 🏴‍☠️",
    "watch": "Watch",
    "skip": "Skip"
  },
  "rewards": {
    "deposit_liquidity": "Deposit liquidity", 
    "deposit_liquidity_rewards_description": "+1,000 per $100/hour",
    "deposit": "Deposit",
    "invite_friends": "Invite friends",
    "invite_friends_rewards_description": "+5,000 per 1 friend + 5% of their points",
    "invite": "Invite",
    "claim": "Claim",
    "invited_friends": "Invited friends",
    "earn_more": "Earn more",
    "earn_points_title": "Earn points for your efforts",
    "claimed": "Claimed",
    "pending": "Pending",
    "referral_title": "Referral link for web page",
    "referral_mini_app": "Referral link to miniapp",
    "copy_referral": "Copy",
    "use_telegram_mini_app": "Use Telegram Mini App to access this section",
    "no_friends_invited": "No friends have been invited yet",
    "telegram_apps_center": "Telegram Apps Center",
    "one_time_rewards_description": "+{{amount}} points"
  }
}

export default Resources;
