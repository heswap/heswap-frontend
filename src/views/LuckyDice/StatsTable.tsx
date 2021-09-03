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
import { DicePrivateRound } from 'state/dice/types'
import StatsRow from './StatsRow'

interface StatsTableProps {
  records: Array<DicePrivateRound>
}

const Table = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
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
      const { betNums, outcome } = records[i]
      if (betNums[outcome - 1]) {
        result[outcome - 1]++
      }
    }
    return result
  }, [records])

  const losses = useMemo(() => {
    const result = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < records.length; i++) {
      const { betNums, outcome } = records[i]
      if (!betNums[outcome - 1]) {
        result[outcome - 1]++
      }
    }
    return result
  }, [records])

  return (
    <Table>
      <Box p="8px 0">
        <Flex>
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
        </Flex>
      </Box>
      <StatsRow color={theme.colors.success} label="Wins" scores={wins} />
      <StatsRow color={theme.colors.failure} label="Losses" scores={losses} />
    </Table>
  )
}

export default StatsTable