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
    const startRoundFilter = diceContract.filters.StartRound(null, null)
    diceContract.on(startRoundFilter, (epoch, blockNumber, bankHash) => {
      console.log(epoch, blockNumber, bankHash)
    })
    // diceContract.events.StartRound({ fromBlock: 0 })
    //   .on('data', (event: StartRoundEvent) => {
    //     console.log(event)
    //     const epoch = new BigNumber(event.returnValues.epoch)
    //     if (epoch.eq(currentEpoch)) {
    //       setRoundStatus(DiceRoundStatus.Open)
    //     } else if (epoch.gt(currentEpoch)) {
    //       setCurrentEpoch(epoch)
    //       setRoundStatus(DiceRoundStatus.Open)
    //     }
    //   })
    //   .on('error', console.error)
    diceContract.on('LockRound', (from, to, amount, event) => {
      console.log(event)
    })
    // diceContract.events.LockRound({ fromBlock: 0 })
    //   .on('data', (event: LockRoundEvent) => {
    //     console.log(event)
    //     const epoch = new BigNumber(event.returnValues.epoch)
    //     if (epoch.eq(currentEpoch)) {
    //       setRoundStatus(DiceRoundStatus.Lock)
    //     } else if (epoch.gt(currentEpoch)) {
    //       setCurrentEpoch(epoch)
    //       setRoundStatus(DiceRoundStatus.Lock)
    //     }
    //   })
    //   .on('error', console.error)
    diceContract.on('BetNumber', (from, to, amount, event) => {
      console.log(event)
    })
    // diceContract.events.BetNumber({ fromBlock: 0 })
    //   .on('data', (event) => {
    //     console.log(event)
    //   })
    //   .on('error', console.error)
    diceContract.on('EndPlayerTime', (from, to, amount, event) => {
      console.log(event)
    })
    // diceContract.events.EndPlayerTime({ fromBlock: 0 })
    //   .on('data', (event: EndPlayerTimeEvent) => {
    //     console.log(event)
    //     setPaused(true)
    //   })
    //   .on('error', console.error)
    diceContract.on('EndBankerTime', (from, to, amount, event) => {
      console.log(event)
    })
    // diceContract.events.EndBankerTime({ fromBlock: 0 })
    //   .on('data', (event: EndBankerTimeEvent) => {
    //     console.log(event)
    //     setPaused(false)
    //     const epoch = new BigNumber(event.returnValues.epoch)
    //     if (epoch.eq(currentEpoch)) {
    //       setRoundStatus(DiceRoundStatus.Open)
    //     } else if (epoch.gt(currentEpoch)) {
    //       setCurrentEpoch(epoch)
    //       setRoundStatus(DiceRoundStatus.Open)
    //     }
    //   })
    //   .on('error', console.error)
    diceContract.on('Deposit', (from, to, amount, event) => {
      console.log(event)
    })
    // diceContract.events.Deposit({ fromBlock: 0 })
    //   .on('data', (event: DepositEvent) => {
    //     console.log(event)
    //   })
    //   .on('error', console.error)
    diceContract.on('Withdraw', (from, to, amount, event) => {
      console.log(event)
    })
    // diceContract.events.Withdraw({ fromBlock: 0 })
    //   .on('data', (event: WithdrawEvent) => {
    //     console.log(event)
    //   })
    //   .on('error', console.error)
  }, [diceContract, currentEpoch])

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

  const handleBet = async (sideToggles: Array<boolean>, amount: string) => {
    if (paused) {
      return;
    }
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NODE_2)
    const options = {
      value: ethers.utils.parseEther('0.001'),
      gasPrice: await provider.getGasPrice(),
      gasLimit: 500000
    }
    const tx = await diceContract.betNumber(sideToggles, ethers.utils.parseEther(amount), options)
    const receipt = await tx.wait()
    console.log(`Tx hash,${receipt.transactionHash},status,${receipt.status}`)

    const diceTokenBalance = await diceTokenContract.balanceOf(account)
    console.log(`diceTokenBalance,${diceTokenBalance.toString()}`)
  }

  const { balance } = useTokenBalance(getWbnbAddress())

  return { paused, currentEpoch, roundStatus, balance, handleBet }
}

export default useGame
