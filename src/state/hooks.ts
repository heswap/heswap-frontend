import { useEffect, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { farmsConfig } from 'config/constants'
import web3NoAccount from 'utils/web3'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { getDiceContract } from 'utils/contractHelpers'
import { getDiceAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import Dice from 'config/abi/dice/Dice.json'
import { fetchFarmsPublicDataAsync, fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync, setBlock } from './actions'
import { State, Farm, Pool, FarmsState, DiceRoundResult, DiceRound } from './types'
import { transformPool } from './pools/helpers'
import { fetchPoolsStakingLimitsAsync } from './pools'
import { fetchFarmUserDataAsync, nonArchivedFarms } from './farms'
import { updateState } from './dice'

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchFarmsPublicDataAsync(pids))

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

/**
 * Fetches the "core" farm data used globally
 * 0 = CAKE-BNB LP
 * 1 = BUSD-BNB LP
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([0, 1]))
  }, [dispatch, fastRefresh])
}

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await web3NoAccount.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  return farm && new BigNumber(farm.token.busdPrice)
}

export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol)
  const tokenPrice = useBusdPriceFromPid(tokenFarm?.pid)
  return tokenPrice
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// Pools

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await web3NoAccount.eth.getBlockNumber()
      dispatch(fetchPoolsPublicDataAsync(blockNumber))
    }

    fetchPoolsPublicData()
    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh])
}

export const usePools = (account): { pools: Pool[]; userDataLoaded: boolean } => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pools: pools.map(transformPool), userDataLoaded }
}

export const usePoolFromPid = (sousId: number): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return transformPool(pool)
}

// Price
export const usePriceCakeBusd = (): BigNumber => {
  const cakeBnbFarm = useFarmFromPid(1)
  return new BigNumber(cakeBnbFarm.token.busdPrice)
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

// Dice
export const useDice = () => {
  return useSelector((state: State) => state.dice)
}

const POLL_TIME_IN_SECONDS = 6

function convertRoundResult(roundResult: DiceRoundResult): DiceRound {
  const round: DiceRound = {
    startBlock: roundResult.startBlock.toString(),
    lockBlock: roundResult.lockBlock.toString(),
    secretSentBlock: roundResult.secretSentBlock.toString(),
    bankHash: roundResult.bankHash,
    bankSecret: roundResult.bankSecret.toString(),
    totalAmount: roundResult.totalAmount.toString(),
    maxBetAmount: roundResult.maxBetAmount.toString(),
    lcBackAmount: roundResult.lcBackAmount.toString(),
    bonusAmount: roundResult.bonusAmount.toString(),
    swapLcAmount: roundResult.swapLcAmount.toString(),
    betUsers: roundResult.betUsers.toString(),
    finalNumber: roundResult.finalNumber,
    status: roundResult.status
  }
  if (roundResult.betAmounts) {
    round.betAmounts = []
    for (let i = 0; i < roundResult.betAmounts.length; i++) {
      round.betAmounts.push(roundResult.betAmounts[i].toString())
    }
  }
  return round
}

export const usePollDiceData = () => {
  const timer = useRef<NodeJS.Timeout>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current)
    }
    const diceContract = getDiceContract()
    timer.current = setInterval(async () => {
      const diceAddr = getDiceAddress()
      const calls = [{
        address: diceAddr,
        name: 'paused'
      },{
        address: diceAddr,
        name: 'bankerTimeBlocks'
      },{
        address: diceAddr,
        name: 'playerTimeBlocks'
      },{
        address: diceAddr,
        name: 'bankerEndBlock'
      },{
        address: diceAddr,
        name: 'playerEndBlock'
      },{
        address: diceAddr,
        name: 'currentEpoch'
      },{
        address: diceAddr,
        name: 'intervalBlocks'
      }]
      const [
        _paused,
        _bankerTimeBlocks,
        _playerTimeBlocks,
        _bankerEndBlock,
        _playerEndBlock,
        _currentEpoch,
        _intervalBlocks
      ] = await multicall(Dice.abi, calls)
      const paused: boolean = _paused[0] // hack due to multicall
      const bankerTimeBlocks: ethers.BigNumber = ethers.BigNumber.from(_bankerTimeBlocks.toString())
      const playerTimeBlocks: ethers.BigNumber = ethers.BigNumber.from(_playerTimeBlocks.toString())
      const bankerEndBlock: ethers.BigNumber = ethers.BigNumber.from(_bankerEndBlock.toString())
      const playerEndBlock: ethers.BigNumber = ethers.BigNumber.from(_playerEndBlock.toString())
      const currentEpoch: ethers.BigNumber = ethers.BigNumber.from(_currentEpoch.toString())
      const intervalBlocks: ethers.BigNumber = ethers.BigNumber.from(_intervalBlocks.toString())
      let currentRound: DiceRound = null
      let rounds: Array<DiceRound> = []
      if (currentEpoch.gt(0)) {
        let end: ethers.BigNumber = currentEpoch.sub(20) // fetch 20 records, not 100 records
        if (end.lt(1)) {
          end = ethers.BigNumber.from(1)
        }
        const roundCalls = []
        for (let i: ethers.BigNumber = currentEpoch; i.gte(end); i = i.sub(1)) {
          roundCalls.push({
            address: diceAddr,
            name: 'rounds',
            params: [i.toString()]
          })
        }
        const roundResults = await multicall(Dice.abi, roundCalls)
        currentRound = convertRoundResult(roundResults[0])
        for (let j = 1; j < roundResults.length; j++) {
          rounds.push(convertRoundResult(roundResults[j]))
        }
        rounds = roundResults.map(roundResult => convertRoundResult(roundResult))
      }
      dispatch(updateState({
        paused,
        bankerTimeBlocks: bankerTimeBlocks.toString(),
        playerTimeBlocks: playerTimeBlocks.toString(),
        currentGame: {
          bankerEndBlock: bankerEndBlock.toString(),
          playerEndBlock: playerEndBlock.toString()
        },
        currentEpoch: currentEpoch.toString(),
        intervalBlocks: intervalBlocks.toString(),
        currentRound,
        rounds
      }))
    }, POLL_TIME_IN_SECONDS * 1000)

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [dispatch])
}
