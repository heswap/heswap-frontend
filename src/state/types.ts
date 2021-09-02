import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { FarmConfig, PoolConfig } from 'config/constants/types'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }

export type SerializedBigNumber = string

export interface Farm extends FarmConfig {
  tokenAmountMc?: SerializedBigNumber
  quoteTokenAmountMc?: SerializedBigNumber
  tokenAmountTotal?: SerializedBigNumber
  quoteTokenAmountTotal?: SerializedBigNumber
  lpTotalInQuoteToken?: SerializedBigNumber
  lpTotalSupply?: SerializedBigNumber
  tokenPriceVsQuote?: SerializedBigNumber
  poolWeight?: SerializedBigNumber
  userData?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  startBlock?: number
  endBlock?: number
  apr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

// Slices states

export interface FarmsState {
  data: Farm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

export interface PoolsState {
  data: Pool[]
  userDataLoaded: boolean
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

// Global state

export interface State {
  block: BlockState
  farms: FarmsState
  pools: PoolsState
  dice: DiceState
}

// Dice

enum Status {
  Pending = 0,
  Open,
  Lock,
  Claimable,
  Expired
}

export interface DiceGame {
  bankerEndBlock: string
  playerEndBlock: string
}

export interface DiceRoundResult {
  startBlock: ethers.BigNumber
  lockBlock: ethers.BigNumber
  secretSentBlock: ethers.BigNumber
  bankHash: string
  bankSecret: ethers.BigNumber
  totalAmount: ethers.BigNumber
  maxBetAmount: ethers.BigNumber
  betAmounts?: Array<ethers.BigNumber>
  lcBackAmount: ethers.BigNumber
  bonusAmount: ethers.BigNumber
  swapLcAmount: ethers.BigNumber
  betUsers: ethers.BigNumber
  finalNumber: number
  status: Status
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
  status: Status
}

export interface DiceHistoryRecord {
  betHash: string
  account: string
  betNums: Array<boolean>
  betAmount: string
  outcome: number
  time: number
  roll: number
  profit: number
}

export interface BetInfo {
  amount: ethers.BigNumber
  numberCount: number
  numbers?: Array<boolean>
  claimed: boolean
  lcClaimed: boolean
}

export interface DiceState {
  attending?: boolean
  bankerTimeBlocks?: string
  playerTimeBlocks?: string
  currentGame?: DiceGame
  currentEpoch?: string
  intervalBlocks?: string
  currentRound?: DiceRound
  paused?: boolean
  rounds?: Array<DiceRound>
  publicHistoryRecords?: Array<DiceHistoryRecord>
  privateHistoryRecords?: Array<DiceHistoryRecord>
  claimable?: boolean
}
