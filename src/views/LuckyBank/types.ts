import { BigNumber } from 'ethers'
import { Token } from 'config/constants/types'

export interface BankRowProps {
  stakingToken: Token
  earningToken: Token
  balance: BigNumber
}

export interface BankTableProps {
  records: Array<BankRowProps>
}
