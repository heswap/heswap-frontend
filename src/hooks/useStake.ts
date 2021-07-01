import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { useMasterChef, useSousChef } from './useContract'

const useStake = (pid: number) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterChef()

  const handleStake = useCallback(
    async (amount: string, referrer: string) => {
      const txHash = await stake(masterChefContract, pid, amount, referrer, account)
      console.info(txHash)
    },
    [account, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId: number, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterChef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number, referrer: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, referrer, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
