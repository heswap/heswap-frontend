import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getDiceContract } from 'utils/contractHelpers'
import useRefresh from 'hooks/useRefresh'

export const usePaused = () => {
  const { slowRefresh } = useRefresh()
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    async function fetchPaused() {
      const diceContract = getDiceContract()
      const p = await diceContract.paused()
      setPaused(p)
    }

    fetchPaused()
  }, [slowRefresh])

  return paused
}

export default usePaused
