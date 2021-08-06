import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getCakeContract,
  getMasterChefContract,
  getSousChefContract,
  getErc721Contract,
  getDiceContract,
  getDiceTokenContract,
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getErc721Contract(address, web3), [address, web3])
}

export const useCake = () => {
  const web3 = useWeb3()
  return useMemo(() => getCakeContract(web3), [web3])
}

export const useMasterChef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterChefContract(web3), [web3])
}

export const useSousChef = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSousChefContract(id, web3), [id, web3])
}
