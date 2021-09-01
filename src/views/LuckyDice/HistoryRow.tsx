import React from 'react'
import styled from 'styled-components'
import { BigNumber, ethers } from 'ethers'
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

function getChance(betNums: Array<boolean>) {
  if (!betNums) {
    return '0'
  }
  const result = betNums.length * 100 / 6
  return parseFloat(result.toFixed(2)).toString() // remove trailing zero
}

const HistoryRow: React.FC<HistoryRowProps> = ({ betHash, account, betNums, betAmount, outcome, time, roll, profit, mode }) => {
  const { theme } = useTheme()

  return (
    <Box p="8px 0">
      <GridLayout>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{`${betHash.substr(0, 4)}...${betHash.substr(betHash.length - 4)}`}</Text>
        </div>
        {mode === 'public' && (
          <div style={{ textAlign: 'center' }}>
            <Text color="textSubtle">{`${account.substr(0, 4)}...${account.substr(account.length - 4)}`}</Text>
          </div>
        )}
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
        {mode === 'private' && (
          <div style={{ textAlign: 'center' }}>
            <Text color="textSubtle">{roll}</Text>
          </div>
        )}
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

export default HistoryRow
