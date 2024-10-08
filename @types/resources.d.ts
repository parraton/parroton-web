/* eslint-disable prettier/prettier */
interface Resources {
  "common": {
    "get_data_error": "Failed to get data, please reload the page",
    "app_title": "Parraton",
    "app_description": "Description for Parraton",
    "amount": "Amount",
    "deposit": "Deposit",
    "withdraw": "Withdraw",
    "rewards": "Claim Rewards",
    "apy": "APY",
    "earn": "Earn",
    "settings": "Settings",
    "tokens": "Tokens",
  },
  "form": {
    "deposit_title": "Deposit",
    "deposit_description": "Deposit your lp to automate rewards reinvestment.",
    "preview_deposit": "Preview Deposit",
    "preview_withdraw": "Preview Withdraw",
    "confirm_deposit": "Confirm Deposit",
    "confirm_withdraw": "Confirm Withdraw",
    "connect_wallet_to_deposit": "Connect wallet to deposit",
    "connect_wallet_to_withdraw": "Connect wallet to withdraw",
    "your_balance": "Your balance",
    "some_token_exchange_rate": "{{token}} exchange rate",
    "get_lp_description": "Not enough LP? Invest in DeDust pool",
    "withdraw_title": "Withdraw",
    "withdraw_description": "Burn your PLPs to get underlying LPs",
    "faucet_title": "Faucet",
    "faucet_description": "Get some free tokens to test our platform",
    "claim_title": "Claim",
    "claim_description": "Get extra rewards from our platform",
    "deposit_or_withdraw_title": "Deposit/Withdraw",
    "deposit_or_withdraw_description": "Deposit or withdraw your LPs to manage rewards reinvestment",
    "validation": {
      "required": "Field is required",
      "invalid_format": "Invalid format",
      "min_deposit": "Deposit can not be zero",
      "max_deposit": "Deposit can not be more than {{maxAmount}}",
      "min_withdraw": "Withdraw can not be zero",
      "max_withdraw": "Withdraw can not be more than {{maxAmount}}"
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
    "max_label": "MAX",
    "back": "Back",
    "stats": "Stats",
    "deposit_header_in_usd": "Earn up to <1>{{amount}}</1>\nin <2>{{symbol}}</2> yearly",
    "deposit_header_in_asset": "Earn up to <1>{{amount}}</1>\n{{symbol}} yearly",
    "you_deposit": "You deposit",
    "you_withdraw": "You withdraw",
    "you_get": "You get",
  },
  "kpi": {
    "our_goals": "Our goals",
    "our_kpi": "Our KPI",
    "reach_together": "Let’s reach them together",
    "goals": {
      "revenue": "{{revenue_goal}} Revenue",
      "tvl": "{{tvl_goal}} TVL",
      "shares": "{{share_goal}} of Dedust Lp"
    },
    "close": "Close",
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
    "settings_title": "Settings",
    "theme_title": "Theme",
    "language_title": "Language",
    "links": "Links",
    "website": "Website",
    "telegram_mini_app": "Telegram miniapp",
    "telegram_channel": "Telegram channel",
    "docs": "Docs",
  },
  "terms": {
    "header": "Accept Terms",
    "description": "By using this platform, you agree to our <1>Terms of Use and Privacy Policy</1>. The platform is not responsible for any losses incurred. Use at your own risk.",
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
    "pending_reinvest": "To be reinvested",
    "reinvest_tooltip": "This is the total pending rewards for all users. The reinvest happens once per day if at least 7 TON are in pending rewards",
    "extraApr": "Extra APR",
    "tvl": "TVL",
    "deposit_asset": "Deposit asset",
    "you_earn": "You earn",
    "yield": "Yield",
    "you_deposit": "You deposit",
    "use_max": "Use Max",
    "put_your_liquidity_at_work": "Put your <1>liquidity</1> at work",
    "actual_asset_postfix": " in {{tokenSymbol}}",
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
    "earn_points_title": "Earn <1>points</1> for your <2>efforts</2>",
    "claimed": "Claimed",
    "pending": "Pending",
    "referral_title": "Referral link for web page",
    "referral_mini_app": "Referral link to miniapp",
    "copy_referral": "Copy",
    "use_telegram_mini_app": "Use Telegram Mini App to access this section",
    "no_friends_invited": "No friends have been invited yet",
    "telegram_apps_center": "Telegram Apps Center",
    "one_time_rewards_description": "+{{amount}} points",
    "level_number": "Level {{level}}",
    "link_copied": "Copied"
  }
}

export default Resources;
