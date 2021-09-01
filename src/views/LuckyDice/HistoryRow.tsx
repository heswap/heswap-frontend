import React from 'react'
import styled from 'styled-components'
import { FaBitcoin } from 'react-icons/fa'
import moment from 'moment'
import { Box, Grid, Text } from '@heswap/uikit'
import useTheme from 'hooks/useTheme'
import { HistoryRowProps } from './types'

const GridLayout = styled(Grid)`
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 16px;
`;

function getProfitText(value: number) {
  const sign = value > 0 ? '+' : '-'
  return `${sign}${Math.abs(value)}`
}

function getChance(betNums: Array<number>) {
  const toggled = betNums.filter(x => x)
  const result = toggled.length * 100 / 6
  return parseFloat(result.toFixed(2)).toString() // remove trailing zero
}

const HistoryRow: React.FC<HistoryRowProps> = ({ id, betNums, betAmount, outcome, time, roll, profit }) => {
  const { theme } = useTheme()

  return (
    <Box p="8px 0">
      <GridLayout>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{id}</Text>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
          <Box mr="8px">
            <FaBitcoin color={theme.colors.text} />
          </Box>
          <Text color="text" bold>{betAmount}</Text>
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
          <Box mr="8px">
            <FaBitcoin color={theme.colors[profit > 0 ? 'success' : 'failure']} />
          </Box>
          <Text color={profit > 0 ? 'success' : 'failure'}>{getProfitText(profit)}</Text>
        </div>
      </GridLayout>
    </Box>
  )
}

export default HistoryRow
