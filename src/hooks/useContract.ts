import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getCakeContract,
  getMasterChefContract,
  getSousChefContract,
  getWbnbContract,
  getDiceContract,
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useBEP20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
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

export const useWbnbContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getWbnbContract(library.getSigner()), [library])
}

export const useDiceContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getDiceContract(library.getSigner()), [library])
}
