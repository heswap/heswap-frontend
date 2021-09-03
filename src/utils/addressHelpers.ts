import { MAINNET_CHAIN_ID } from 'config'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'
import { getAddress as getEthersAddress } from '@ethersproject/address'

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
export const getLcAddress = () => {
  return getAddress(tokens.lc.address)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getReferralAddress = () => {
  return getAddress(addresses.referrals)
}
export const getDiceAddress = () => {
  return getAddress(addresses.dice)
}
export const getDiceTokenAddress = () => {
  return getAddress(addresses.diceToken)
}

export const getBusdAddress = () => {
  return getAddress(tokens.busd.address)
}
export const getBtcbAddress = () => {
  return getAddress(tokens.btcb.address)
}
export const getEthAddress = () => {
  return getAddress(tokens.eth.address)
}

export const isAddress = (value: any): string | false => {
  try {
    return getEthersAddress(value)
  } catch {
    return false
  }
}
