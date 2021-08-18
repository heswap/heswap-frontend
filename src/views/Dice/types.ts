import { ethers } from 'ethers'

export interface HistoryRecord {
  bets: Array<number>
  outcome: number
}

export interface HistoryRowProps extends HistoryRecord {
  id: number
}

export enum DiceRoundStatus {
  Pending,
  Open,
  Lock,
  Claimable,
  Expired,
}

export interface DiceRound {
  startBlock: ethers.BigNumber
  lockBlock: ethers.BigNumber
  secretSentBlock: ethers.BigNumber
  bankHash: string // 32 bytes -> 64-digits hex string + "0x" prepend
  bankSecret: ethers.BigNumber
  totalAmount: ethers.BigNumber
  maxBetAmount: ethers.BigNumber
  betAmounts?: Array<ethers.BigNumber>
  lcBackAmount: ethers.BigNumber
  bonusAmount: ethers.BigNumber
  swapLcAmount: ethers.BigNumber
  betUsers: ethers.BigNumber
  finalNumber: any
  status: any
}

export interface DiceBetInfo {
  amount: ethers.BigNumber
  numberCount: number
  numbers: Array<boolean>
  claimed: boolean
  isClaimed: boolean
}

export interface DiceBankerInfo {
  diceTokenAmount: ethers.BigNumber
  avgBuyValue: ethers.BigNumber
}

export interface EndBankerTimeEventValues {
  epoch: any
  blockNumber: any
}

export interface EndBankerTimeEvent {
  address: string
  returnValues: EndBankerTimeEventValues
}

export interface StartRoundEventValues {
  epoch: any
  blockNumber: any
  bankHash: string
}

export interface StartRoundEvent {
  address: string
  returnValues: StartRoundEventValues
}

export interface EndPlayerTimeEventValues {
  epoch: any
  blockNumber: any
}

export interface EndPlayerTimeEvent {
  address: string
  returnValues: EndPlayerTimeEventValues
}

export interface LockRoundEventValues {
  epoch: any
  blockNumber: any
}

export interface LockRoundEvent {
  address: string
  returnValues: LockRoundEventValues
}

export interface DepositEventValues {
  user: string
  tokenAmount: any
}

export interface DepositEvent {
  address: string
  returnValues: DepositEventValues
}

export interface WithdrawEventValues {
  user: any
  diceTokenAmount: any
}

export interface WithdrawEvent {
  address: string
  returnValues: WithdrawEventValues
}
