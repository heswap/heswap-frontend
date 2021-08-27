import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Box, Flex, useMatchBreakpoints } from '@heswap/uikit'
import {
  GiDiceSixFacesOne,
  GiDiceSixFacesTwo,
  GiDiceSixFacesThree,
  GiDiceSixFacesFour,
  GiDiceSixFacesFive,
  GiDiceSixFacesSix,
  GiInvertedDice1,
  GiInvertedDice2,
  GiInvertedDice3,
  GiInvertedDice4,
  GiInvertedDice5,
  GiInvertedDice6,
} from 'react-icons/gi'
import useTheme from 'hooks/useTheme'
import StatsRow from './StatsRow'
import { HistoryRecord } from './types'

interface StatsTableProps {
  records: Array<HistoryRecord>;
}

const Table = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledFlex = styled(Flex)`
  padding-top: 8px;
  padding-bottom: 8px;
`

const StatsTable: React.FC<StatsTableProps> = ({ records }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const { theme } = useTheme()

  const renderSide = (side: number, filled: boolean, color: string) => {
    let size = '0'
    if (isXs) {
      size = '24px'
    } else if (isSm) {
      size = '24px'
    } else if (isMd) {
      size = '32px'
    } else if (isLg) {
      size = '32px'
    } else if (isXl) {
      size = '32px'
    }
    if (side === 1) {
      return React.createElement(filled ? GiDiceSixFacesOne : GiInvertedDice1, { size, color })
    }
    if (side === 2) {
      return React.createElement(filled ? GiDiceSixFacesTwo : GiInvertedDice2, { size, color })
    }
    if (side === 3) {
      return React.createElement(filled ? GiDiceSixFacesThree : GiInvertedDice3, { size, color })
    }
    if (side === 4) {
      return React.createElement(filled ? GiDiceSixFacesFour : GiInvertedDice4, { size, color })
    }
    if (side === 5) {
      return React.createElement(filled ? GiDiceSixFacesFive : GiInvertedDice5, { size, color })
    }
    if (side === 6) {
      return React.createElement(filled ? GiDiceSixFacesSix : GiInvertedDice6, { size, color })
    }
    return null
  }

  const wins = useMemo(() => {
    const result = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < records.length; i++) {
      const { bets, outcome } = records[i]
      if (bets.includes(outcome)) {
        result[outcome - 1]++
      }
    }
    return result
  }, [records])

  const losses = useMemo(() => {
    const result = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < records.length; i++) {
      const { bets, outcome } = records[i]
      if (!bets.includes(outcome)) {
        result[outcome - 1]++
      }
    }
    return result
  }, [records])

  return (
    <Table>
      <StyledFlex>
        <div style={{ textAlign: 'center', width: '100px' }} />
        <Box mx={['8px', '16px', '32px', '64px', '128px']} style={{ flex: 1 }}>
          <Flex justifyContent="space-around">
            {[1, 2, 3, 4, 5, 6].map((side, index) => (
              <div key={index.toString()}>
                {renderSide(side, true, theme.colors.primary)}
              </div>
            ))}
          </Flex>
        </Box>
      </StyledFlex>
      <StatsRow color={theme.colors.success} label="Wins" scores={wins} />
      <StatsRow color={theme.colors.failure} label="Losses" scores={losses} />
    </Table>
  )
}

export default StatsTable