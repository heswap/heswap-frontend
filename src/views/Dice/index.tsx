import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import useWeb3 from 'hooks/useWeb3'
import { useWeb3React } from '@web3-react/core'
import { getDiceContract, getDiceTokenContract } from 'utils/contractHelpers'
import PageHeader from './PageHeader'
import HistoryTable from './HistoryTable'
import BetModal from './BetModal'
import { DiceRound, DiceRoundStatus } from './types'

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
  background: ${({ checked, theme }) => checked ? theme.colors.secondary : theme.colors.backgroundAlt};

  & > .dot {
    background: ${({ checked, theme }) => checked ? theme.colors.backgroundAlt : '#444'};
    box-shadow: inset 5px 0 10px ${({ checked }) => checked ? '#888' : '#000'};
  }
`

const StyledButton = styled(Button)`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.secondary};
`

const fakeRecords = [];
for (let i = 0; i < 100; i++) {
  const bets = [];
  for (let j = 1; j <= 6; j++) {
    if (Math.random() < 0.5) {
      bets.push(j)
    }
  }
  fakeRecords.push({
    id: i + 1,
    bets,
    outcome: Math.ceil(Math.random() * 5) + 1
  })
}

const Dice: React.FC = () => {
  const { account } = useWeb3React()
  const [sideToggles, setSideToggles] = useState([true, false, false, false, false, false])
  const [records, setRecords] = useState(fakeRecords)
  const callingOptions = useRef({})
  const paused = useRef(true)
  const rounds = useRef([])
  const userRounds = useRef([])

  const web3 = useWeb3()
  const diceContract = useMemo(() => getDiceContract(web3), [web3])
  const betModalTitle = useMemo(() => {
    const sideNumbers = []
    for (let i = 0; i < sideToggles.length; i++) {
      if (sideToggles[i]) {
        sideNumbers.push(i + 1)
      }
    }
    return `Bet Numbers: [${sideNumbers.join(', ')}]`
  }, [sideToggles])

  const handleBet = async (amount: string) => {
    await diceContract.methods.betNumber(sideToggles, amount).call(callingOptions.current)
    // dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const [onPresentBet] = useModal(
    <BetModal title={betModalTitle} max={new BigNumber(1)} onConfirm={handleBet} tokenName="WBNB" />
  )

  useEffect(() => {
    diceContract.events.StartRound({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.LockRound({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.BetNumber({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.EndPlayerTime({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.EndBankerTime({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.Deposit({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
    diceContract.events.Withdraw({ fromBlock: 0 })
      .on('data', (event) => {
        console.log(event)
      })
      .on('error', console.error)
  }, [diceContract])

  useEffect(() => {
    async function fetchData() {
      callingOptions.current = {
        gasPrice: await web3.eth.getGasPrice(),
        gasLimit: 500000
      }
      paused.current = await diceContract.methods.paused().call(callingOptions.current)
      console.log('paused', paused.current)
      const t = await diceContract.methods.currentEpoch().call(callingOptions.current)
      const currentEpoch = new BigNumber(t)

      // fetch public history
      if (currentEpoch.toString() !== '0') {
        const results = []
        for (let i = 0; i < 100; i++) {
          const n: BigNumber = currentEpoch.minus(i)
          if (n.toString() === '0') {
            break
          }
          const result: Promise<DiceRound> = diceContract.methods.rounds(n.toString()).call(callingOptions.current)
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

      // fetch private history
      const newUserRounds: Array<BigNumber> = await diceContract.methods.getUserRounds(account, 0, 100).call(callingOptions.current)
      userRounds.current = newUserRounds
    }

    fetchData()
  }, [web3, account, diceContract])

  const handleSideClick = (index) => {
    const toggles = [...sideToggles]
    toggles[index] = !toggles[index]
    setSideToggles(toggles)
  }

  const getWinningChance = () => {
    const toggled = sideToggles.filter(x => x)
    const result = toggled.length * 100 / 6
    return parseFloat(result.toFixed(2)).toString() // remove trailing zero
  }

  return (
    <>
      <PageHeader>
        <Flex position="relative">
          {paused.current ? (
            <div style={{ height: 200 }} />
          ) : (
            <RollingDice style={{ zIndex: 1 }} />
          )}
          <LeftLogo />
          <RightLogo />
        </Flex>
      </PageHeader>
      <Page>
        {!paused.current && (
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
        {!paused.current && (
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

export default Dice
