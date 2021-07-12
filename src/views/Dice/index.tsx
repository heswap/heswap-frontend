import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Flex, Grid, Heading } from '@heswap/uikit'
import RollingDice from 'components/RollingDice'
import Page from 'components/layout/Page'
import PageHeader from './PageHeader'
import HistoryTable from './HistoryTable'

const GradientPanel = styled(Box)`
  border-radius: ${({ theme }) => theme.radii.card};
  background: linear-gradient(235deg, rgb(51, 111, 245) 4.05%, rgba(17, 81, 225, 0.32) 103.52%);
  padding: 32px;
`

const WhitePanel = styled(Box)`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 32px;
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

const Dice: React.FC = () => {
  const [sideToggles, setSideToggles] = useState([true, false, false, false, false, false])
  const [records, setRecords] = useState([{
    id: 1,
    bets: [1, 3, 6],
    outcome: 2
  },{
    id: 2,
    bets: [1, 2, 5],
    outcome: 5
  }])

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
        <RollingDice />
      </PageHeader>
      <Page>
        <GradientPanel>
          <Flex>
            <Box width={[1, 1/3]} style={{ textAlign: 'center' }}>
              <Label>Winning Chance</Label>
              <Value>{getWinningChance()}%</Value>
            </Box>
            <Box width={[1, 1/3]} style={{ textAlign: 'center' }}>
              <Label>Winning Bet Pays</Label>
              <Value>0.000</Value>
              <Label>ANT</Label>
              <Label>(with tax and fee)</Label>
            </Box>
            <Box width={[1, 1/3]} style={{ textAlign: 'center' }}>
              <Label>Winning Return Rate</Label>
              <Value>5.88x</Value>
            </Box>
          </Flex>
        </GradientPanel>
        <GradientPanel mt="32px">
          <Grid
            justifyItems="center"
            alignContent="center"
            gridTemplateColumns="1fr 1fr 1fr"
            gridColumnGap="-16px"
            gridRowGap="-16px"
          >
            <Side checked={sideToggles[0]} onClick={() => handleSideClick(0)}>
              <div className="dot center" />
            </Side>
            <Side checked={sideToggles[1]} onClick={() => handleSideClick(1)}>
              <div className="dot dtop dleft" />
              <div className="dot dbottom dright" />
            </Side>
            <Side checked={sideToggles[2]} onClick={() => handleSideClick(2)}>
              <div className="dot dtop dleft" />
              <div className="dot center" />
              <div className="dot dbottom dright" />
            </Side>
            <Side checked={sideToggles[3]} onClick={() => handleSideClick(3)}>
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
            </Side>
            <Side checked={sideToggles[4]} onClick={() => handleSideClick(4)}>
              <div className="dot center" />
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
            </Side>
            <Side checked={sideToggles[5]} onClick={() => handleSideClick(5)}>
              <div className="dot dtop dleft" />
              <div className="dot dtop dright" />
              <div className="dot dbottom dleft" />
              <div className="dot dbottom dright" />
              <div className="dot center dleft" />
              <div className="dot center dright" />
            </Side>
          </Grid>
          <Box mt="24px" style={{ textAlign: 'center' }}>
            <StyledButton>Unlock Wallet</StyledButton>
          </Box>
          <Box mt="16px" style={{ textAlign: 'center' }}>
            <Label>Unlock wallet to bet</Label>
          </Box>
        </GradientPanel>
        <WhitePanel mt="32px">
          <HistoryTable records={records} />
        </WhitePanel>
      </Page>
    </>
  )
}

export default Dice
