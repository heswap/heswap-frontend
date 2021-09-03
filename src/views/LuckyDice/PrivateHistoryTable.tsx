import React, { useRef } from 'react'
import styled from 'styled-components'
import { BigNumber, ethers } from 'ethers'
import moment from 'moment'
import { Box, Button, ChevronUpIcon, Grid, Text } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DicePrivateRound } from 'state/dice/types'

interface PrivateHistoryTableProps {
  records: Array<DicePrivateRound>
}

const Table = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const GridLayout = styled(Grid)`
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 16px;
`

function getProfitText(value: number) {
  const sign = value > 0 ? '+' : '-'
  return `${sign}${Math.abs(value)}`
}

function getChance(betNums: Array<boolean>) {
  if (!betNums) {
    return '0'
  }
  const result = betNums.length * 100 / 6
  return parseFloat(result.toFixed(2)).toString() // remove trailing zero
}

const PrivateHistoryRow: React.FC<DicePrivateRound> = ({ betHash, betNums, betAmount, outcome, time, roll, profit }) => {
  return (
    <Box p="16px 0">
      <GridLayout>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{`${betHash.substr(0, 4)}...${betHash.substr(betHash.length - 4)}`}</Text>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
          <Box width="16px" mr="8px">
            <img alt="" src={`${process.env.PUBLIC_URL}/images/tokens/bnb.png`} />
          </Box>
          <Text color="text" bold>{ethers.utils.formatEther(BigNumber.from(betAmount))}</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{moment.unix(time).format('HH:mm:ss')}</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{getChance(betNums)}%</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{roll}</Text>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
          <Box width="16px" mr="8px">
            <img alt="" src={`${process.env.PUBLIC_URL}/images/tokens/bnb.png`} />
          </Box>
          <Text color={profit > 0 ? 'success' : 'failure'}>{getProfitText(profit)}</Text>
        </div>
      </GridLayout>
    </Box>
  )
}

const HistoryHeader = () => (
  <Box p="8px 0">
    <GridLayout>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Bet Hash</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle" bold>Bet Amount</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Time</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Chance</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Roll</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Profit</Text>
      </div>
    </GridLayout>
  </Box>
)

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const PrivateHistoryTable: React.FC<PrivateHistoryTableProps> = ({ records }) => {
  const { t } = useTranslation()
  const tableRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    tableRef.current.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <>
      <Table ref={tableRef}>
        <HistoryHeader />
        {records.map((record, index) => (
          <PrivateHistoryRow key={index.toString()} {...record} />
        ))}
      </Table>
      <ScrollButtonContainer>
        <Button variant="text" onClick={scrollToTop}>
          {t('To Top')}
          <ChevronUpIcon color="primary" />
        </Button>
      </ScrollButtonContainer>
    </>
  )
}

export default PrivateHistoryTable
