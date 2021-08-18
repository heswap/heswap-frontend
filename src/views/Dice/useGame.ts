import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'hooks/useWeb3'
import useTokenBalance from 'hooks/useTokenBalance'
import { getWbnbAddress } from 'utils/addressHelpers'
import { getDiceContract, getDiceTokenContract, getWbnbContract } from 'utils/contractHelpers'
import {
  DiceRound,
  DiceRoundStatus,
  StartRoundEvent,
  EndBankerTimeEvent,
  EndPlayerTimeEvent,
  LockRoundEvent,
  DepositEvent,
  WithdrawEvent,
} from './types'

const useGame = () => {
  const { account } = useWeb3React()

  const [paused, setPaused] = useState(true)
  const rounds = useRef([])
  const userRounds = useRef([])
  const [currentEpoch, setCurrentEpoch] = useState<ethers.BigNumber>(ethers.BigNumber.from(0))
  const [roundStatus, setRoundStatus] = useState<DiceRoundStatus>(DiceRoundStatus.Open)

  const web3 = useWeb3()
  const diceContract = getDiceContract()
  const diceTokenContract = getDiceTokenContract()
  const wbnbContract = getWbnbContract()

  useEffect(() => {
    async function fetchData() {
      const p = await diceContract.paused()
      setPaused(p)
      console.log('paused', p)
      const epoch: ethers.BigNumber = await diceContract.currentEpoch()
      setCurrentEpoch(epoch)

      // fetch public history
      if (!epoch.eq(0)) {
        const results = []
        for (let i = 0; i < 100; i++) {
          const idx: ethers.BigNumber = epoch.sub(i)
          if (idx.eq(0)) {
            break
          }
          const result: Promise<DiceRound> = diceContract.rounds(idx.toString())
          results.push(result)
        }
        const newRounds: Array<DiceRound> = await Promise.all(results)
        // for (let i = 0; i < newRounds.length; i++) {
        //   newRounds[i].startBlock = ethers.BigNumber.from(newRounds[i].startBlock)
        //   newRounds[i].lockBlock = ethers.BigNumber.from(newRounds[i].lockBlock)
        //   newRounds[i].secretSentBlock = ethers.BigNumber.from(newRounds[i].secretSentBlock)
        //   newRounds[i].bankSecret = ethers.BigNumber.from(newRounds[i].bankSecret)
        //   newRounds[i].totalAmount = ethers.BigNumber.from(newRounds[i].totalAmount)
        //   newRounds[i].maxBetAmount = ethers.BigNumber.from(newRounds[i].maxBetAmount)
        //   newRounds[i].lcBackAmount = ethers.BigNumber.from(newRounds[i].lcBackAmount)
        //   newRounds[i].bonusAmount = ethers.BigNumber.from(newRounds[i].bonusAmount)
        //   newRounds[i].swapLcAmount = ethers.BigNumber.from(newRounds[i].swapLcAmount)
        //   newRounds[i].betUsers = ethers.BigNumber.from(newRounds[i].betUsers)
        //   newRounds[i].finalNumber = parseInt(newRounds[i].finalNumber)
        //   newRounds[i].status = parseInt(newRounds[i].status)
        // }
        rounds.current = newRounds
      }
      if (rounds.current.length > 0) {
        setRoundStatus(rounds.current[0].status)
      }

      // fetch private history
      const newUserRounds: Array<ethers.BigNumber> = await diceContract.getUserRounds(account, 0, 100)
      userRounds.current = newUserRounds
    }

    fetchData()
  }, [web3, account, diceContract])

  const { balance } = useTokenBalance(getWbnbAddress())

  return { paused, currentEpoch, roundStatus, balance }
}

export default useGame
