import dicesConfig from 'config/constants/dices'
import DICE from 'config/abi/dice/Dice.json'
import BEP20 from 'config/abi/dice/BEP20.json'
import DiceTokenAbi from 'config/abi/dice/DiceToken.json'
import multicall from 'utils/multicall'
import { getDiceContract, getMasterChefContract } from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

export const fetchWithdrawableAmounts = async (account) => {
  const calls = dicesConfig.map((dice) => ({
    address: getAddress(dice.contractAddress),
    name: 'canWithdrawToken',
    params: [account],
  }))

  const amounts = await multicall(DICE.abi, calls)
  return dicesConfig.reduce(
    (acc, dice, index) => ({ ...acc, [dice.diceId]: new BigNumber(amounts[index]).toJSON() }),
    {},
  )
}

export const fetchDicesAllowance = async (account) => {
  const calls = dicesConfig.map((dice) => ({
    address: getAddress(dice.depositToken.address),
    name: 'allowance',
    params: [account, getAddress(dice.contractAddress)],
  }))

  const allowances = await multicall(BEP20.abi, calls)
  return dicesConfig.reduce(
    (acc, dice, index) => ({ ...acc, [dice.diceId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchDicesTokenAllowance = async (account) => {
  const calls = dicesConfig.map((dice) => ({
    address: getAddress(dice.diceToken.address),
    name: 'allowance',
    params: [account, getAddress(dice.contractAddress)],
  }))

  const allowances = await multicall(DiceTokenAbi, calls)
  return dicesConfig.reduce(
    (acc, dice, index) => ({ ...acc, [dice.diceId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  const calls = dicesConfig.map((dice) => ({
    address: getAddress(dice.depositToken.address),
    name: 'balanceOf',
    params: [account],
  }))

  const tokenBalances = await multicall(BEP20.abi, calls)
  return dicesConfig.reduce(
    (acc, dice, index) => ({ ...acc, [dice.diceId]: new BigNumber(tokenBalances[index]).toJSON() }),
    {},
  )
}

export const fetchWithdrawableAmount = async (account, diceId) => {
  const dice = dicesConfig.find((d) => d.diceId === diceId)
  const diceContract = getDiceContract(dice.depositToken.symbol)
  const amount = await diceContract.canWithdrawToken(account)

  return new BigNumber(amount)
}

export const fetchProfitRate = async (account, diceId) => {
  const dice = dicesConfig.find((d) => d.diceId === diceId)
  const diceContract = getDiceContract(dice.depositToken.symbol)
  try {
    const profitRate = await diceContract.calProfitRate(account)

    return profitRate
  } catch (e) {
    console.log(e)
    return '0'
  }
}
