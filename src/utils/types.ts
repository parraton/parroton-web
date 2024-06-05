export interface TonApiTransaction {
  event_id: string
  timestamp: number
  actions: Action[]
  value_flow: ValueFlow[]
  is_scam: boolean
  lt: number
  in_progress: boolean
}

export interface Action {
  type: string
  status: string
}


export interface ValueFlow {
  account: Account2
  ton: number
  fees: number
  jettons?: Jetton[]
}

export interface Account2 {
  address: string
  is_scam: boolean
  is_wallet: boolean
}

export interface Jetton {
  account: Account3
  jetton: Jetton2
  quantity: number
}

export interface Account3 {
  address: string
  is_scam: boolean
  is_wallet: boolean
}

export interface Jetton2 {
  address: string
  name: string
  symbol: string
  decimals: number
  image: string
  verification: string
}
