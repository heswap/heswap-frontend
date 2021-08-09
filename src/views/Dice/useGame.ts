import { useEffect, useRef, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'hooks/useWeb3'
import { useDice } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import { getWbnbAddress } from 'utils/addressHelpers'
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

  const callingOptions = useRef({})
  const [paused, setPaused] = useState(true)
  const rounds = useRef([])
  const userRounds = useRef([])
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(new BigNumber(0))
  const [roundStatus, setRoundStatus] = useState<DiceRoundStatus>(DiceRoundStatus.Open)

  const web3 = useWeb3()
  const diceContract = useDice()

  useEffect(() => {
    diceContract.events.StartRound({ fromBlock: 0 })
      .on('data', (event: StartRoundEvent) => {
        console.log(event)
        const epoch = new BigNumber(event.returnValues.epoch)
        if (epoch.eq(currentEpoch)) {
          setRoundStatus(DiceRoundStatus.Open)
        } else if (epoch.gt(currentEpoch)) {
          setCurrentEpoch(epoch)
          setRoundStatus(DiceRoundStatus.Open)
        }
      })
      .on('error', console.error)
    diceContract.events.LockRound({ fromBlock: 0 })
      .on('data', (event: LockRoundEvent) => {
        console.log(event)
        const epoch = new BigNumber(event.returnValues.epoch)
        if (epoch.eq(currentEpoch)) {
          setRoundStatus(DiceRoundStatus.Lock)
        } else if (epoch.gt(currentEpoch)) {
          setCurrentEpoch(epoch)
          setRoundStatus(DiceRoundStatus.Lock)
        }
      })
      .on('error', console.error)
    diceContract.events.BetNumber({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.EndPlayerTime({ fromBlock: 0 })
      .on('data', (event: EndPlayerTimeEvent) => {
        console.log(event)
        setPaused(true)
      })
      .on('error', console.error)
    diceContract.events.EndBankerTime({ fromBlock: 0 })
      .on('data', (event: EndBankerTimeEvent) => {
        console.log(event)
        setPaused(false)
        const epoch = new BigNumber(event.returnValues.epoch)
        if (epoch.eq(currentEpoch)) {
          setRoundStatus(DiceRoundStatus.Open)
        } else if (epoch.gt(currentEpoch)) {
          setCurrentEpoch(epoch)
          setRoundStatus(DiceRoundStatus.Open)
        }
      })
      .on('error', console.error)
    diceContract.events.Deposit({ fromBlock: 0 })
      .on('data', (event: DepositEvent) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.Withdraw({ fromBlock: 0 })
      .on('data', (event: WithdrawEvent) => {
        console.log(event)
      })
      .on('error', console.error)
  }, [diceContract, currentEpoch])

  useEffect(() => {
    async function fetchData() {
      callingOptions.current = {
        gasPrice: await web3.eth.getGasPrice(),
        gasLimit: 500000
      }
      const p = await diceContract.methods.paused().call(callingOptions.current)
      setPaused(p)
      console.log('paused', p)
      const t = await diceContract.methods.currentEpoch().call(callingOptions.current)
      const epoch = new BigNumber(t)
      setCurrentEpoch(epoch)

      // fetch public history
      if (!epoch.eq(0)) {
        const results = []
        for (let i = 0; i < 100; i++) {
          const idx: BigNumber = epoch.minus(i)
          if (idx.eq(0)) {
            break
          }
          const result: Promise<DiceRound> = diceContract.methods.rounds(idx.toString()).call(callingOptions.current)
          results.push(result)
        }
        const newRounds: Array<DiceRound> = await Promise.all(results)
        for (let i = 0; i < newRounds.length; i++) {
          newRounds[i].startBlock = new BigNumber(newRounds[i].startBlock)
          newRounds[i].lockBlock = new BigNumber(newRounds[i].lockBlock)
          newRounds[i].secretSentBlock = new BigNumber(newRounds[i].secretSentBlock)
          newRounds[i].bankSecret = new BigNumber(newRounds[i].bankSecret)
          newRounds[i].totalAmount = new BigNumber(newRounds[i].totalAmount)
          newRounds[i].maxBetAmount = new BigNumber(newRounds[i].maxBetAmount)
          newRounds[i].lcBackAmount = new BigNumber(newRounds[i].lcBackAmount)
          newRounds[i].bonusAmount = new BigNumber(newRounds[i].bonusAmount)
          newRounds[i].swapLcAmount = new BigNumber(newRounds[i].swapLcAmount)
          newRounds[i].betUsers = new BigNumber(newRounds[i].betUsers)
          newRounds[i].finalNumber = parseInt(newRounds[i].finalNumber)
          newRounds[i].status = parseInt(newRounds[i].status)
        }
        rounds.current = newRounds
      }
      if (rounds.current.length > 0) {
        setRoundStatus(rounds.current[0].status)
      }

      // fetch private history
      const newUserRounds: Array<BigNumber> = await diceContract.methods.getUserRounds(account, 0, 100).call(callingOptions.current)
      userRounds.current = newUserRounds
    }

    fetchData()
  }, [web3, account, diceContract])

  const handleBet = async (sideToggles: Array<boolean>, amount: string) => {
    const value = web3.utils.toWei(amount, 'ether')
    await diceContract.methods.betNumber(sideToggles, value).call(callingOptions.current)
    // dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const { balance } = useTokenBalance(getWbnbAddress())

  return { paused, currentEpoch, roundStatus, balance, handleBet }
}

export default useGame
