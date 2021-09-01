import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { BaseLayout, Box, Button, CardsLayout, Flex, Heading, Image, useMatchBreakpoints, useModal } from '@heswap/uikit'
import { BigNumber, ethers } from 'ethers'
import { noop } from 'lodash'
import moment from 'moment'
import 'moment-duration-format'
import { useWeb3React } from '@web3-react/core'
import RollingDice from 'components/RollingDice'
import Page from 'components/layout/Page'
import SwitchButtonGroup from 'components/SwitchButtonGroup'
import useTheme from 'hooks/useTheme'
import { getWbnbAddress, getDiceAddress } from 'utils/addressHelpers'
import { useWbnbContract, useDiceContract } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import useCallWithGasPrice from 'hooks/useCallWithGasPrice'
import { useBlock, useDice } from 'state/hooks'
import { elevations } from 'utils/palette'
import PageHeader from './PageHeader'
import StatsTable from './StatsTable'
import HistoryTable from './HistoryTable'
import BetModal from './BetModal'
import { HistoryRowProps } from './types'

const LeftLogo = styled(Image).attrs(() => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  let width = 0
  let height = 0
  if (isXs) {
    width = 32
    height = 32
  } else if (isSm) {
    width = 48
    height = 48
  } else if (isMd) {
    width = 64
    height = 64
  } else if (isLg) {
    width = 96
    height = 96
  } else if (isXl) {
    width = 128
    height = 128
  }
  return {
    src: `${process.env.PUBLIC_URL}/images/luckychip-token2.png`,
    alt: '',
    width,
    height,
  }
})`
  position: absolute;
  top: 96px;
  left: 32px;
`

const RightLogo = styled(Image).attrs(() => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  let width = 0
  let height = 0
  if (isXs) {
    width = 30
    height = 46
  } else if (isSm) {
    width = 60
    height = 91
  } else if (isMd) {
    width = 89
    height = 137
  } else if (isLg) {
    width = 119
    height = 182
  } else if (isXl) {
    width = 148
    height = 227
  }
  return {
    src: `${process.env.PUBLIC_URL}/images/luckychip-heap.png`,
    alt: '',
    width,
    height,
  }
})`
  position: absolute;
  top: 96px;
  right: 32px;
`

const GradientPanel = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
`

const InfoLayout = styled(CardsLayout)`
  grid-gap: 24px;
`

const PickUpLayout = styled(BaseLayout)`
  & > div {
    grid-column: span 3;
    ${({ theme }) => theme.mediaQueries.sm} {
      grid-column: span 4;
    }
  }
`

const WhitePanel = styled(Box)`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`

const PanelContainer = styled(Box)`
  background-color: ${elevations.dp06};
  padding: 32px 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 16px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 32px;
  }
`

const Label = styled(Heading).attrs({
  as: 'h2',
  scale: 'md',
})`
  color: ${({ theme }) => theme.colors.backgroundAlt};
  font-weight: 300;
  line-height: 1.4;
`

const Value = styled(Heading).attrs({
  as: 'h1',
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
  line-height: 1.4;
`

const Clock = styled.div`
  position: absolute;
  top: 64px;
  width: 100%;
  text-align: center;
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

const SideWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Side = styled.div.attrs({
  className: 'rolling-dice-side',
})<{ checked: boolean }>`
  transform: scale(0.5);
  margin: -40px;
  background: ${({ checked, theme }) => (checked ? theme.colors.secondary : theme.colors.backgroundAlt)};

  & > .dot {
    background: ${({ checked, theme }) => (checked ? theme.colors.backgroundAlt : '#444')};
    box-shadow: inset 5px 0 10px ${({ checked }) => (checked ? '#888' : '#000')};
  }
`

const StyledButton = styled(Button)`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.secondary};
`

function getFakeRecords(len) {
  const items: Array<HistoryRowProps> = []
  for (let i = 0; i < len; i++) {
    const betNums = []
    for (let j = 1; j <= 6; j++) {
      if (Math.random() < 0.5) {
        betNums.push(j)
      }
    }
    const now = new Date()
    items.push({
      id: i + 1,
      betNums,
      betAmount: '0.00000005',
      outcome: Math.ceil(Math.random() * 5) + 1,
      time: Math.floor(now.getTime() / 1000),
      roll: 7485,
      profit: i % 2 === 0 ? 45263215 : -45263215
    })
  }
  return items
}

const LuckyDice: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const [sideToggles, setSideToggles] = useState([true, false, false, false, false, false])
  const [records, setRecords] = useState([])

  const { callWithGasPrice } = useCallWithGasPrice()
  const wbnbContract = useWbnbContract()
  const diceContract = useDiceContract()
  const { attending, paused, bankerTimeBlocks, playerTimeBlocks, currentGame, currentEpoch, intervalBlocks, currentRound } = useDice()
  const [bankerTimeLeft, setBankerTimeLeft] = useState<number>(null)
  const [playerTimeLeft, setPlayerTimeLeft] = useState<number>(null)
  const bankerTimerRef = useRef(null)
  const playerTimerRef = useRef(null)
  const { currentBlock } = useBlock()
  const { balance } = useTokenBalance(getWbnbAddress())
  const [roundNum, setRoundNum] = useState<number>(null)
  const [betted, setBetted] = useState<boolean>(false)
  const autoRolling = useRef(false)
  const [overcome, setOvercome] = useState<number>(null)

  useEffect(() => {
    // onDidMount -> mode == public
    const items = getFakeRecords(100)
    setRecords(items)
  }, [])

  const betModalTitle = useMemo(() => {
    const sideNumbers = []
    for (let i = 0; i < sideToggles.length; i++) {
      if (sideToggles[i]) {
        sideNumbers.push(i + 1)
      }
    }
    return `Bet Numbers: [${sideNumbers.join(', ')}]`
  }, [sideToggles])

  const handleBet = async (toggles, amount) => {
    try {
      // The token holder calls approve to set an allowance of tokens that the contract can use
      // This is from BEP20
      await wbnbContract.approve(getDiceAddress(), ethers.constants.MaxUint256)
      // call betNumber of dice contract
      const tx = await callWithGasPrice(diceContract, 'betNumber', [toggles, ethers.utils.parseEther(amount)], {
        value: ethers.utils.parseEther('0.001'),
      })
      const receipt = await tx.wait()
      console.log(`betNumber,${receipt.transactionHash}`)
      setBetted(true)
      autoRolling.current = true
    } catch (e) {
      console.log(`betNumber failed`, e)
    }
  }

  const [onPresentBet] = useModal(
    <BetModal
      title={betModalTitle}
      max={balance}
      onConfirm={(amount) => {
        handleBet(sideToggles, amount)
      }}
      tokenName="WBNB"
    />,
  )

  const onClaimWinnings = async () => {
    console.log('claim winnings started')
    await diceContract.claim(currentEpoch)
    console.log('claim winnings ended')
  }

  const handleSideClick = (index) => {
    const toggles = [...sideToggles]
    toggles[index] = !toggles[index]
    setSideToggles(toggles)
  }

  const winningChance = useMemo(() => {
    const toggled = sideToggles.filter(x => x)
    const result = toggled.length * 100 / 6
    return parseFloat(result.toFixed(2)).toString() // remove trailing zero
  }, [sideToggles])

  const coin = new URLSearchParams(location.search).get('coin')

  useEffect(() => {
    return history.listen(loc => {
      const mode = new URLSearchParams(loc.search).get('mode')
      const items = getFakeRecords(mode === 'private' ? 20 : 100)
      setRecords(items)
    })
  }, [history])

  useEffect(() => {
    if (bankerTimerRef) {
      clearInterval(bankerTimerRef.current)
    }
    if (currentBlock === 0 || !currentGame || !paused) {
      return () => { noop() }
    }
    let timeLeft: number = BigNumber.from(currentGame.bankerEndBlock).sub(BigNumber.from(currentBlock)).mul(3).toNumber() // each block is nearly 3 seconds in bsc
    bankerTimerRef.current = setInterval(() => {
      setBankerTimeLeft(timeLeft)
      timeLeft--
    }, 1000)
    return () => {
      if (bankerTimerRef) {
        clearInterval(bankerTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBlock, currentGame])

  useEffect(() => {
    if (playerTimerRef) {
      clearInterval(playerTimerRef.current)
    }
    if (currentBlock === 0 || !currentGame || paused) {
      return () => { noop() }
    }
    let timeLeft: number = BigNumber.from(currentGame.playerEndBlock).sub(BigNumber.from(currentBlock)).mul(3).toNumber() // each block is nearly 3 seconds in bsc
    playerTimerRef.current = setInterval(() => {
      setPlayerTimeLeft(timeLeft)
      timeLeft--
    }, 1000)
    return () => {
      if (playerTimerRef) {
        clearInterval(playerTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBlock, currentGame])

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

  useEffect(() => {
    if (!playerTimeLeft || !intervalBlocks) {
      setRoundNum(null)
      return
    }
    const roundTime = BigNumber.from(intervalBlocks).toNumber() * 3 // in seconds
    if (playerTimeLeft % roundTime <= 10 && autoRolling.current) { // transition time of dice is 6 seconds
      autoRolling.current = false
    }
    const v = Math.floor((playerTimeLeft + roundTime - 1) / roundTime)
    setRoundNum(25 - v + 1)
  }, [playerTimeLeft, intervalBlocks])

  useEffect(() => {
    setBetted(false)
    setOvercome(null)
  }, [roundNum])

  useEffect(() => {
    if (currentRound) {
      console.log('finalNumber', currentRound.finalNumber)
    }
  }, [currentRound])

  const roundTimeLabel = useMemo(() => {
    if (!playerTimeLeft || !intervalBlocks) {
      return ''
    }
    const roundTime = BigNumber.from(intervalBlocks).toNumber() * 3 // in seconds
    const optionalPrefix = moment.duration(playerTimeLeft % roundTime, 'seconds').format('y [years] w [weeks] d [days] h')
    const requiredSurfix = moment.duration(playerTimeLeft % roundTime, 'seconds').format('mm:ss', { trim: false })
    if (optionalPrefix === '0') {
      return requiredSurfix
    }
    return `${optionalPrefix}:${requiredSurfix}`
  }, [playerTimeLeft, intervalBlocks])

  const onRollStart = () => {
    setOvercome(null)
  }

  const onRollEnd = (sideNum) => {
    console.log(sideNum)
    setOvercome(sideNum)
  }

  return (
    <>
      <PageHeader background={theme.pageHeader.background}>
        <Flex position="relative">
          {paused ? (
            <div style={{ height: 200 }} />
          ) : (
            <RollingDice
              style={{ zIndex: 1 }}
              roundNum={roundNum}
              disabled={!betted}
              autoRolling={autoRolling.current}
              onRollStart={onRollStart}
              onRollEnd={onRollEnd}
            />
          )}
          <LeftLogo />
          <RightLogo />
          {paused && (
            <Clock>
              <Label>Now Banker Time</Label>
              <TimeLabel>{bankerTimeLabel}</TimeLabel>
            </Clock>
          )}
          {!paused && (
            <Clock>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                <div>
                  <Label>Round</Label>
                  <TimeLabel>{roundNum}</TimeLabel>
                </div>
                <div>
                  <Label>Time Left</Label>
                  <TimeLabel>{roundTimeLabel}</TimeLabel>
                </div>
              </div>
            </Clock>
          )}
        </Flex>
      </PageHeader>
      {paused && (
        <Page>
          <GradientPanel>
            <Box background={elevations.dp06} p="32px">
              <Box style={{ textAlign: 'center' }}>
                <StyledButton onClick={onClaimWinnings}>
                  Claim Winnings
                </StyledButton>
              </Box>
            </Box>
          </GradientPanel>
        </Page>
      )}
      {!paused && (
        <Page>
          <GradientPanel>
            <Box background={elevations.dp06} p="32px">
              <InfoLayout>
                <Box style={{ textAlign: 'center' }}>
                  <Label>Winning Chance</Label>
                  <Value>{winningChance}%</Value>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <Label>Winning Bet Pays</Label>
                  <Value>0.000</Value>
                  <Label>ANT</Label>
                  <Label>(with tax and fee)</Label>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <Label>Winning Return Rate</Label>
                  <Value>5.88x</Value>
                </Box>
              </InfoLayout>
            </Box>
          </GradientPanel>
          <GradientPanel mt="32px">
            <Box background={elevations.dp06} p="32px">
              <PickUpLayout>
                <SideWrapper>
                  <Side checked={sideToggles[0]} onClick={() => handleSideClick(0)}>
                    <div className="dot center" />
                  </Side>
                </SideWrapper>
                <SideWrapper>
                  <Side checked={sideToggles[1]} onClick={() => handleSideClick(1)}>
                    <div className="dot dtop dleft" />
                    <div className="dot dbottom dright" />
                  </Side>
                </SideWrapper>
                <SideWrapper>
                  <Side checked={sideToggles[2]} onClick={() => handleSideClick(2)}>
                    <div className="dot dtop dleft" />
                    <div className="dot center" />
                    <div className="dot dbottom dright" />
                  </Side>
                </SideWrapper>
                <SideWrapper>
                  <Side checked={sideToggles[3]} onClick={() => handleSideClick(3)}>
                    <div className="dot dtop dleft" />
                    <div className="dot dtop dright" />
                    <div className="dot dbottom dleft" />
                    <div className="dot dbottom dright" />
                  </Side>
                </SideWrapper>
                <SideWrapper>
                  <Side checked={sideToggles[4]} onClick={() => handleSideClick(4)}>
                    <div className="dot center" />
                    <div className="dot dtop dleft" />
                    <div className="dot dtop dright" />
                    <div className="dot dbottom dleft" />
                    <div className="dot dbottom dright" />
                  </Side>
                </SideWrapper>
                <SideWrapper>
                  <Side checked={sideToggles[5]} onClick={() => handleSideClick(5)}>
                    <div className="dot dtop dleft" />
                    <div className="dot dtop dright" />
                    <div className="dot dbottom dleft" />
                    <div className="dot dbottom dright" />
                    <div className="dot center dleft" />
                    <div className="dot center dright" />
                  </Side>
                </SideWrapper>
              </PickUpLayout>
              <Box mt="24px" style={{ textAlign: 'center' }}>
                {!account ? (
                  <Label>Connect wallet to bet</Label>
                ) : (
                  <StyledButton
                    onClick={onPresentBet}
                    disabled={paused || !currentRound || betted}
                  >
                    Bet with Amount
                  </StyledButton>
                )}
              </Box>
            </Box>
          </GradientPanel>
          <Box mt="32px">
            <SwitchButtonGroup
              buttons={[{
                url: `/lucky_dice?coin=${coin}`,
                node: <span>Public</span>
              },{
                url: `/lucky_dice?coin=${coin}&mode=private`,
                node: <span>Private</span>
              }]}
            />
          </Box>
          <WhitePanel mt="32px">
            <PanelContainer>
              <StatsTable records={records} />
            </PanelContainer>
          </WhitePanel>
          <WhitePanel mt="32px">
            <PanelContainer>
              <HistoryTable records={records} />
            </PanelContainer>
          </WhitePanel>
        </Page>
      )}
    </>
  )
}

export default LuckyDice
