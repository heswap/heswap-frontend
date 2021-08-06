import BigNumber from 'bignumber.js'

export interface HistoryRecord {
  bets: Array<number>;
  outcome: number;
}

export interface HistoryRowProps extends HistoryRecord {
  id: number;
}

export enum DiceRoundStatus {
  Pending,
  Open,
  Lock,
  Claimable,
  Expired
}

export interface DiceRound {
  startBlock: BigNumber;
  lockBlock: BigNumber;
  secretSentBlock: BigNumber;
  bankHash: string; // 32 bytes -> 64-digits hex string + "0x" prepend
  bankSecret: BigNumber;
  totalAmount: BigNumber;
  maxBetAmount: BigNumber;
  betAmounts?: Array<BigNumber>;
  lcBackAmount: BigNumber;
  bonusAmount: BigNumber;
  swapLcAmount: BigNumber;
  betUsers: BigNumber;
  finalNumber: any;
  status: any;
}

export interface DiceBetInfo {
  amount: BigNumber;
  numberCount: number;
  numbers: Array<boolean>;
  claimed: boolean;
  isClaimed: boolean;
}

export interface DiceBankerInfo {
  diceTokenAmount: BigNumber;
  avgBuyValue: BigNumber;
}
