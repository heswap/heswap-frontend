import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Box, Flex, Heading, Image, Text } from '@heswap/uikit'
import { noop, orderBy, partition } from 'lodash'
import moment from 'moment'
import 'moment-duration-format'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { useBlock, usePools, useFetchPublicPoolsData, usePollFarmsData, useDice } from 'state/hooks'
import { latinise } from 'utils/latinise'
import { isAddress } from 'utils/addressHelpers'
import { AddressZero } from '@ethersproject/constants'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select'
import { Pool } from 'state/types'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView'
import { getAprData } from './helpers'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const Clock = styled.div`
  padding-top: 32px;
  width: 100%;
  text-align: center;
`

const Label = styled(Heading).attrs({
  as: 'h2',
  scale: 'md',
})`
  color: ${({ theme }) => theme.colors.backgroundAlt};
  font-weight: 300;
  line-height: 1.4;
`

const TimeLabel = styled(Heading).attrs({
  as: 'h1',
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.success};
  font-family: monospace;
  font-weight: 600;
  line-height: 1.4;
`

const PoolControls = styled(Flex)`
  gap: 8px;
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Title = styled(Heading).attrs({
  as: 'h1',
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.backgroundAlt};
  font-weight: 600;
  line-height: 1.4;
`

const Description = styled(Heading).attrs({
  as: 'h2',
  scale: 'md',
  color: 'textSubtle',
})`
  font-weight: 300;
  line-height: 1.4;
`

const HeaderStuff = styled.div`
  height: 136px;
`

const LuckyBank: React.FC = () => {
  const location = useLocation()
  let referrer = AddressZero
  if (location.pathname.substring(7) && isAddress(location.pathname.substring(7))) {
    referrer = location.pathname.substring(7)
    console.log(`referral link, ref=${referrer}`)
  } else {
    console.log('not referral link')
  }

  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'pancake_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_farm_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const { attending, bankerTimeBlocks, playerTimeBlocks, currentGame, currentEpoch, currentRound, casted, paused } = useDice()
  const [bankerTimeLeft, setBankerTimeLeft] = useState(null)
  const [playerTimeLeft, setPlayerTimeLeft] = useState(null)
  const bankerTimerRef = useRef(null)
  const playerTimerRef = useRef(null)
  const { currentBlock } = useBlock()

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData()
  useFetchPublicPoolsData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet && loadMoreRef.current) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet, loadMoreRef])

  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(poolsToSort, (pool: Pool) => (pool.apr ? getAprData(pool).apr : 0), 'desc')
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(poolsToSort, (pool: Pool) => pool.totalStaked.toNumber(), 'desc')
      default:
        return poolsToSort
    }
  }

  const poolsToShow = () => {
    let chosenPools = []
    if (showFinishedPools) {
      chosenPools = finishedPools
    } else {
      chosenPools = openPools
    }

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
      )
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  }

  const cardLayout = (
    <CardLayout>
      {poolsToShow().map((pool) => (
        <PoolCard key={pool.sousId} pool={pool} account={account} referrer={referrer} />
      ))}
    </CardLayout>
  )

  const tableLayout = (
    <PoolsTable pools={poolsToShow()} account={account} userDataLoaded={userDataLoaded} referrer={referrer} />
  )

  useEffect(() => {
    if (bankerTimerRef) {
      clearInterval(bankerTimerRef.current)
    }
    if (currentBlock === 0 || !currentGame || !paused) {
      return () => { noop() }
    }
    let timeLeft = ethers.BigNumber.from(currentGame.bankerEndBlock).sub(ethers.BigNumber.from(currentBlock)).mul(3).toNumber() // each block is nearly 3 seconds in bsc
    bankerTimerRef.current = setInterval(() => {
      setBankerTimeLeft(timeLeft)
      timeLeft--
    }, 1000)
    return () => {
      if (bankerTimerRef) {
        clearInterval(bankerTimerRef.current)
      }
    }
  }, [currentBlock, currentGame, paused])

  useEffect(() => {
    if (playerTimerRef) {
      clearInterval(playerTimerRef.current)
    }
    if (currentBlock === 0 || !currentGame || paused) {
      return () => { noop() }
    }
    let timeLeft = ethers.BigNumber.from(currentGame.playerEndBlock).sub(ethers.BigNumber.from(currentBlock)).mul(3).toNumber() // each block is nearly 3 seconds in bsc
    playerTimerRef.current = setInterval(() => {
      setPlayerTimeLeft(timeLeft)
      timeLeft--
    }, 1000)
    return () => {
      if (playerTimerRef) {
        clearInterval(playerTimerRef.current)
      }
    }
  }, [currentBlock, currentGame, paused])

  const bankerTimeLabel = useMemo(() => {
    if (!bankerTimeLeft) {
      return ''
    }
    const optionalPrefix = moment.duration(bankerTimeLeft, 'seconds').format('y [years] w [weeks] d [days] h')
    const requiredSurfix = moment.duration(bankerTimeLeft, 'seconds').format('mm:ss', { trim: false })
    if (optionalPrefix === '0') {
      return requiredSurfix
    }
    return `${optionalPrefix}:${requiredSurfix}`
  }, [bankerTimeLeft])

  const playerTimeLabel = useMemo(() => {
    if (!playerTimeLeft) {
      return ''
    }
    const optionalPrefix = moment.duration(playerTimeLeft, 'seconds').format('y [years] w [weeks] d [days] h')
    const requiredSurfix = moment.duration(playerTimeLeft, 'seconds').format('mm:ss', { trim: false })
    if (optionalPrefix === '0') {
      return requiredSurfix
    }
    return `${optionalPrefix}:${requiredSurfix}`
  }, [playerTimeLeft])

  return (
    <>
      <PageHeader>
        {/* <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']} position="relative">
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Title mb="24px">{t('Lucky Bank')}</Title>
            <Description>{t('Just stake some tokens to earn.')}</Description>
            <Description>{t('High APR, low risk.')}</Description>
          </Flex>
          <Box position="absolute" top={32} right={32}>
            <HelpButton />
          </Box>
        </Flex> */}
        <HeaderStuff />
      </PageHeader>
      {paused && (
        <Clock>
          <Label>Now Banker Time</Label>
          <TimeLabel>{bankerTimeLabel}</TimeLabel>
        </Clock>
      )}
      {!paused && (
        <Clock>
          <Label>Now Player Time</Label>
          <TimeLabel>{playerTimeLabel}</TimeLabel>
        </Clock>
      )}
      {paused && (
        <Page>
          <PoolControls justifyContent="space-between">
            <PoolTabButtons
              stakedOnly={stakedOnly}
              setStakedOnly={setStakedOnly}
              hasStakeInFinishedPools={hasStakeInFinishedPools}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <SearchSortContainer>
              <Flex flexDirection="column" width="50%">
                <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                  {t('Sort by')}
                </Text>
                <ControlStretch>
                  <Select
                    options={[
                      {
                        label: t('Hot'),
                        value: 'hot',
                      },
                      {
                        label: t('APR'),
                        value: 'apr',
                      },
                      {
                        label: t('Earned'),
                        value: 'earned',
                      },
                      {
                        label: t('Total staked'),
                        value: 'totalStaked',
                      },
                    ]}
                    onChange={handleSortOptionChange}
                  />
                </ControlStretch>
              </Flex>
              <Flex flexDirection="column" width="50%">
                <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                  {t('Search')}
                </Text>
                <ControlStretch>
                  <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
                </ControlStretch>
              </Flex>
            </SearchSortContainer>
          </PoolControls>
          {showFinishedPools && (
            <Text fontSize="20px" color="failure" pb="32px">
              {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
            </Text>
          )}
          {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
          <div ref={loadMoreRef} />
          <Image
            mx="auto"
            mt="12px"
            src={`${process.env.PUBLIC_URL}/images/3d-syrup-bunnies.png`}
            alt="Pancake illustration"
            width={192}
            height={184.5}
          />
        </Page>
      )}
    </>
  )
}

export default LuckyBank
