import tokens from './tokens'
import { DiceConfig } from './types'
import addresses from './contracts'

const dices: DiceConfig[] = [
  {
    diceId: 0,
    depositToken: tokens.wbnb,
    diceToken: tokens.wbnbDice,
    contractAddress: addresses.wbnbDice,
  },
  {
    diceId: 1,
    depositToken: tokens.lc,
    diceToken: tokens.lcDice,
    contractAddress: addresses.lcDice,
  },
  {
    diceId: 2,
    depositToken: tokens.busd,
    diceToken: tokens.busdDice,
    contractAddress: addresses.busdDice,
  },
  {
    diceId: 3,
    depositToken: tokens.btcb,
    diceToken: tokens.btcbDice,
    contractAddress: addresses.btcbDice,
  },
  {
    diceId: 4,
    depositToken: tokens.eth,
    diceToken: tokens.ethDice,
    contractAddress: addresses.ethDice,
  },
]

export default dices
