import { MAINNET_CHAIN_ID } from 'config'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'
import { getAddress as getEthAddress } from '@ethersproject/address'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[MAINNET_CHAIN_ID]
}

export const getCakeAddress = () => {
  return getAddress(tokens.cake.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getMulticall2Address = () => {
  return getAddress(addresses.multiCall2)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getBusdAddress = () => {
  return getAddress(tokens.busd.address)
}
export const getBtcbAddress = () => {
  return getAddress(tokens.btcb.address)
}
export const getBETHAddress = () => {
  return getAddress(tokens.eth.address)
}
export const getLCAddress = () => {
  return getAddress(tokens.lc.address)
}
export const getReferralAddress = () => {
  return getAddress(addresses.referrals)
}
export const getDiceAddress = (symbol) => {
  switch (symbol) {
    case 'LC':
      return getAddress(addresses.lcDice)
    case 'WBNB':
      return getAddress(addresses.wbnbDice)
    case 'BUSD':
      return getAddress(addresses.busdDice)
    case 'BTCB':
      return getAddress(addresses.btcbDice)
    case 'ETH':
      return getAddress(addresses.ethDice)
    default:
      return getAddress(addresses.lcDice)
  }
}
export const getDiceTokenAddress = (symbol) => {
  switch (symbol) {
    case 'LC':
      return getAddress(addresses.lcDiceToken)
    case 'WBNB':
      return getAddress(addresses.wbnbDiceToken)
    case 'BUSD':
      return getAddress(addresses.busdDiceToken)
    case 'BTCB':
      return getAddress(addresses.btcbDiceToken)
    case 'ETH':
      return getAddress(addresses.ethDiceToken)
    default:
      return getAddress(addresses.lcDiceToken)
  }
}

export const isAddress = (value: any): string | false => {
  try {
    return getEthAddress(value)
  } catch {
    return false
  }
}
