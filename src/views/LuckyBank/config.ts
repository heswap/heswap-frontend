import { BigNumber } from 'ethers'
import tokens from 'config/constants/tokens'
import { BankRowProps } from './types'

const config: Array<BankRowProps> = [{
  stakingToken: tokens.wbnb,
  earningToken: tokens.cake,
  balance: BigNumber.from(0)
},{
  stakingToken: tokens.busd,
  earningToken: tokens.cake,
  balance: BigNumber.from(0)
},{
  stakingToken: tokens.btcb,
  earningToken: tokens.cake,
  balance: BigNumber.from(0)
},{
  stakingToken: tokens.eth,
  earningToken: tokens.cake,
  balance: BigNumber.from(0)
}]

export default config
