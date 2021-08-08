import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'

// Addresses
import {
  getAddress,
  getCakeAddress,
  getMasterChefAddress,
  getMulticallAddress,
  getMulticall2Address,
  getReferralAddress,
  getDiceAddress,
  getDiceTokenAddress,
} from 'utils/addressHelpers'

// ABI
import BEP20 from 'config/abi/dice/BEP20.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import MasterChef from 'config/abi/dice/MasterChef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import MultiCall2 from 'config/abi/dice/Multicall2.json'
import referralsAbi from 'config/abi/referrals.json'

import Dice from 'config/abi/dice/Dice.json'
import DiceToken from 'config/abi/dice/DiceToken.json'

import { DEFAULT_GAS_PRICE, TESTNET_CHAIN_ID } from 'config'
import { getSettings, getGasPriceInWei } from './settings'

export const getDefaultGasPrice = () => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  if (chainId === TESTNET_CHAIN_ID) {
    return 10
  }
  return DEFAULT_GAS_PRICE
}

const getContract = (abi: any, address: string, web3?: Web3, account?: string) => {
  const _web3 = web3 ?? web3NoAccount
  const gasPrice = account ? getSettings(account).gasPrice : getDefaultGasPrice()

  return new _web3.eth.Contract(abi as unknown as AbiItem, address, {
    gasPrice: getGasPriceInWei(gasPrice).toString(),
  })
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(BEP20.abi, address, web3)
}
export const getLpContract = (address: string, web3?: Web3) => {
  return getContract(lpTokenAbi, address, web3)
}
export const getCakeContract = (web3?: Web3) => {
  return getContract(cakeAbi, getCakeAddress(), web3)
}
export const getMasterChefContract = (web3?: Web3) => {
  return getContract(MasterChef.abi, getMasterChefAddress(), web3)
}
export const getMulticallContract = (web3?: Web3) => {
  return getContract(MultiCallAbi, getMulticallAddress(), web3)
}
export const getMulticall2Contract = (web3?: Web3) => {
  return getContract(MultiCall2.abi, getMulticall2Address(), web3)
}
export const getSousChefContract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChef, getAddress(config.contractAddress), web3)
}
export const getSousChefV2Contract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2, getAddress(config.contractAddress), web3)
}
export const getReferralContract = (web3?: Web3) => {
  return getContract(referralsAbi, getReferralAddress(), web3)
}

export const getDiceContract = (web3?: Web3) => {
  return getContract(Dice.abi, getDiceAddress(), web3)
}
export const getDiceTokenContract = (web3?: Web3) => {
  return getContract(DiceToken.abi, getDiceTokenAddress(), web3)
}
