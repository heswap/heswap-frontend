import { useEffect, useRef } from 'react'
import BigNumber from 'bignumber.js'
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

export const usePollDiceData = () => {
  const timer = useRef<NodeJS.Timeout>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current)
    }
    const diceContract = getDiceContract()
    timer.current = setInterval(async () => {
      const paused: boolean = await diceContract.paused()
      const _bankerTimeBlocks: BigNumber = await diceContract.bankerTimeBlocks()
      const _playerTimeBlocks: BigNumber = await diceContract.playerTimeBlocks()
      const _startBlock: BigNumber = await diceContract.currentEpoch()
      const _bankerEndBlock: BigNumber = await diceContract.bankerEndBlock()
      const _playerEndBlock: BigNumber = await diceContract.playerEndBlock()
      const _currentEpoch: BigNumber = await diceContract.currentEpoch()
      const currentRoundResult: DiceRoundResult = await diceContract.rounds(_currentEpoch)
      const currentRound: DiceRound = {
        startBlock: currentRoundResult.startBlock.toString(),
        lockBlock: currentRoundResult.lockBlock.toString(),
        secretSentBlock: currentRoundResult.secretSentBlock.toString(),
        bankHash: currentRoundResult.bankHash,
        bankSecret: currentRoundResult.bankSecret.toString(),
        totalAmount: currentRoundResult.totalAmount.toString(),
        maxBetAmount: currentRoundResult.maxBetAmount.toString(),
        lcBackAmount: currentRoundResult.lcBackAmount.toString(),
        bonusAmount: currentRoundResult.bonusAmount.toString(),
        swapLcAmount: currentRoundResult.swapLcAmount.toString(),
        betUsers: currentRoundResult.betUsers.toString(),
        finalNumber: currentRoundResult.finalNumber,
        status: currentRoundResult.status
      }
      if (currentRoundResult.betAmounts) {
        currentRound.betAmounts = []
        for (let i = 0; i < currentRoundResult.betAmounts.length; i++) {
          currentRound.betAmounts.push(currentRoundResult.betAmounts[i].toString())
        }
      }
      dispatch(updateState({
        bankerTimeBlocks: _bankerTimeBlocks.toString(),
        playerTimeBlocks: _playerTimeBlocks.toString(),
        currentGame: {
          startBlock: _startBlock.toString(),
          bankerEndBlock: _bankerEndBlock.toString(),
          playerEndBlock: _playerEndBlock.toString()
        },
        currentEpoch: _currentEpoch.toString(),
        currentRound,
        paused
      }))
    }, POLL_TIME_IN_SECONDS * 1000)

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [dispatch])
}
