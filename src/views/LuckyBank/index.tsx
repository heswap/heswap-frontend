import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Heading, Image } from '@heswap/uikit'
import { noop } from 'lodash'
import moment from 'moment'
import 'moment-duration-format'
import { useBlock, useDice } from 'state/hooks'
import { isAddress } from 'utils/addressHelpers'
import { AddressZero } from '@ethersproject/constants'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import { getLcContract, getWbnbContract, getBusdContract, getBtcbContract, getEthContract } from 'utils/contractHelpers'
import tokens from 'config/constants/tokens'
import { BankRowProps } from './types'
import BankTable from './BankTable'

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

  const { account } = useWeb3React()
  const { attending, bankerTimeBlocks, playerTimeBlocks, currentGame, currentEpoch, currentRound, paused } = useDice()
  const [bankerTimeLeft, setBankerTimeLeft] = useState(null)
  const [playerTimeLeft, setPlayerTimeLeft] = useState(null)
  const bankerTimerRef = useRef(null)
  const playerTimerRef = useRef(null)
  const { currentBlock } = useBlock()

  const config: Array<BankRowProps> = [{
    stakingToken: tokens.lc,
    earningToken: tokens.dice,
    stakingBalance: BigNumber.from(0),
    earningBalance: BigNumber.from(0),
    onDeposit: () => {
      console.log('deposit from lc')
    },
    onWithdraw: () => {
      console.log('withdraw to lc')
    }
  },{
    stakingToken: tokens.wbnb,
    earningToken: tokens.dice,
    stakingBalance: BigNumber.from(0),
    earningBalance: BigNumber.from(0),
    onDeposit: () => {
      console.log('deposit from wbnb')
    },
    onWithdraw: () => {
      console.log('withdraw to wbnb')
    }
  },{
    stakingToken: tokens.busd,
    earningToken: tokens.dice,
    stakingBalance: BigNumber.from(0),
    earningBalance: BigNumber.from(0),
    onDeposit: () => {
      console.log('deposit from busd')
    },
    onWithdraw: () => {
      console.log('withdraw to busd')
    }
  },{
    stakingToken: tokens.btcb,
    earningToken: tokens.dice,
    stakingBalance: BigNumber.from(0),
    earningBalance: BigNumber.from(0),
    onDeposit: () => {
      console.log('deposit from btcb')
    },
    onWithdraw: () => {
      console.log('withdraw to btcb')
    }
  },{
    stakingToken: tokens.eth,
    earningToken: tokens.dice,
    stakingBalance: BigNumber.from(0),
    earningBalance: BigNumber.from(0),
    onDeposit: () => {
      console.log('deposit from eth')
    },
    onWithdraw: () => {
      console.log('withdraw to eth')
    }
  }]
  const [records, setRecords] = useState(config)

  useEffect(() => {
    async function fetchWBNB() {
      const lcContract = getLcContract()
      const lcBalance = await lcContract.balanceOf(account)
      records[0].stakingBalance = lcBalance
      const wbnbContract = getWbnbContract()
      const wbnbBalance = await wbnbContract.balanceOf(account)
      records[1].stakingBalance = wbnbBalance
      const busdContract = getBusdContract()
      const busdBalance = await busdContract.balanceOf(account)
      records[2].stakingBalance = busdBalance
      const btcbContract = getBtcbContract()
      const btcbBalance = await btcbContract.balanceOf(account)
      records[3].stakingBalance = btcbBalance
      const ethContract = getEthContract()
      const ethBalance = await ethContract.balanceOf(account)
      records[4].stakingBalance = ethBalance
      setRecords(records)
    }
    fetchWBNB()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    if (bankerTimerRef) {
      clearInterval(bankerTimerRef.current)
    }
    if (currentBlock === 0 || !currentGame || !paused) {
      return () => { noop() }
    }
    let timeLeft = BigNumber.from(currentGame.bankerEndBlock).sub(BigNumber.from(currentBlock)).mul(3).toNumber() // each block is nearly 3 seconds in bsc
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
    let timeLeft = BigNumber.from(currentGame.playerEndBlock).sub(BigNumber.from(currentBlock)).mul(3).toNumber() // each block is nearly 3 seconds in bsc
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
      {/* {paused && (
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
      {paused && ( */}
        <Page>
          <BankTable records={records} />
          <Image
            mx="auto"
            mt="12px"
            src={`${process.env.PUBLIC_URL}/images/3d-syrup-bunnies.png`}
            alt="Pancake illustration"
            width={192}
            height={184.5}
          />
        </Page>
      {/* )} */}
    </>
  )
}

export default LuckyBank
