import React, { useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useDiceContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import styled from 'styled-components'
import {
  BaseLayout,
  Box,
  Button,
  CardsLayout,
  Flex,
  Heading,
  Image,
  useMatchBreakpoints,
  useModal,
} from '@heswap/uikit'
import BigNumber from 'bignumber.js'
import RollingDice from 'components/RollingDice'
import Page from 'components/layout/Page'
import { useWeb3React } from '@web3-react/core'
import PageHeader from './PageHeader'
import HistoryTable from './HistoryTable'
import BetModal from './BetModal'
import useGame from './useGame'

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
    src: `${process.env.PUBLIC_URL}/images/luckychip-token3.png`,
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
    src: `${process.env.PUBLIC_URL}/images/luckychip-token4.png`,
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
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.gradients.cardDiagonal};
  padding: 32px;
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
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
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
  color: ${({ theme }) => theme.colors.warning};
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

const fakeRecords = []
for (let i = 0; i < 100; i++) {
  const bets = []
  for (let j = 1; j <= 6; j++) {
    if (Math.random() < 0.5) {
      bets.push(j)
    }
  }
  fakeRecords.push({
    id: i + 1,
    bets,
    outcome: Math.ceil(Math.random() * 5) + 1,
  })
}

const DiceView: React.FC = () => {
  const { account } = useWeb3React()
  const [sideToggles, setSideToggles] = useState([true, false, false, false, false, false])
  const [records, setRecords] = useState(fakeRecords)

  const { paused, balance } = useGame()
  const { callWithGasPrice } = useCallWithGasPrice()
  const diceContract = useDiceContract()

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
      const tx = await callWithGasPrice(diceContract, 'betNumber', [toggles, ethers.utils.parseEther(amount)], {
        value: ethers.utils.parseEther('0.001'),
      })
      const receipt = await tx.wait()
      console.log(`betNumber,${receipt.transactionHash}`)
    } catch {
      console.log(`betNumber failed`)
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

  const handleSideClick = (index) => {
    const toggles = [...sideToggles]
    toggles[index] = !toggles[index]
    setSideToggles(toggles)
  }

  const getWinningChance = () => {
    const toggled = sideToggles.filter((x) => x)
    const result = (toggled.length * 100) / 6
    return parseFloat(result.toFixed(2)).toString() // remove trailing zero
  }

  return (
    <>
      <PageHeader>
        <Flex position="relative">
          {paused ? <div style={{ height: 200 }} /> : <RollingDice style={{ zIndex: 1 }} />}
          <LeftLogo />
          <RightLogo />
        </Flex>
      </PageHeader>
      <Page>
        {!paused && (
          <GradientPanel>
            <InfoLayout>
              <Box style={{ textAlign: 'center' }}>
                <Label>Winning Chance</Label>
                <Value>{getWinningChance()}%</Value>
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
          </GradientPanel>
        )}
        {!paused && (
          <GradientPanel mt="32px">
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
            {!account && (
              <Box mt="16px" style={{ textAlign: 'center' }}>
                <Label>Connect wallet to bet</Label>
              </Box>
            )}
            <Box mt="24px" style={{ textAlign: 'center' }}>
              <StyledButton onClick={onPresentBet}>Bet with Amount</StyledButton>
            </Box>
          </GradientPanel>
        )}
        <WhitePanel mt="32px">
          <HistoryTable records={records} />
        </WhitePanel>
      </Page>
    </>
  )
}

export default DiceView
