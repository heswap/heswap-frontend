import { BigNumber } from 'ethers'

export enum DiceStatus {
  Pending = 0,
  Open,
  Claimable,
  Expired
}

export interface DiceGame {
  bankerEndBlock: string
  playerEndBlock: string
}

export interface DiceRoundResult {
  startBlock: BigNumber
  lockBlock: BigNumber
  secretSentBlock: BigNumber
  bankHash: string
  bankSecret: BigNumber
  totalAmount: BigNumber
  maxBetAmount: BigNumber
  betAmounts?: Array<BigNumber>
  lcBackAmount: BigNumber
  bonusAmount: BigNumber
  swapLcAmount: BigNumber
  betUsers: BigNumber
  finalNumber: number
  status: DiceStatus
}

export interface DiceRound {
  startBlock: string
  lockBlock: string
  secretSentBlock: string
  bankHash: string
  bankSecret: string
  totalAmount: string
  maxBetAmount: string
  betAmounts?: Array<string>
  lcBackAmount: string
  bonusAmount: string
  swapLcAmount: string
  betUsers: string
  finalNumber: number
  status: DiceStatus
}

export interface DicePrivateRound {
  betHash: string
  betNums: Array<boolean>
  betAmount: string
  outcome: number
  time: number
  roll: number
  profit: number
}

export interface BetInfo {
  amount: BigNumber
  numberCount: number
  numbers?: Array<boolean>
  claimed: boolean
  lcClaimed: boolean
}

export interface DiceState {
  attending?: boolean
  paused?: boolean
  bankerTimeBlocks?: string
  playerTimeBlocks?: string
  currentGame?: DiceGame
  currentEpoch?: string
  intervalBlocks?: string
  prevDrawnNumber?: number
  claimable?: boolean
  currentRound?: DiceRound
  rounds?: Array<DiceRound>
  privateRounds?: Array<DicePrivateRound>
}
