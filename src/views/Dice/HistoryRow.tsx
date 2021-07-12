import React from 'react'
import styled from 'styled-components'
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
import { Box, Flex, Text, useMatchBreakpoints } from '@heswap/uikit'
import useTheme from 'hooks/useTheme'
import { HistoryRowProps } from './types'

const StyledFlex = styled(Flex)`
  padding-top: 8px;
  padding-bottom: 8px;
`

const RowNo = styled(Box)`
  width: 64px;
  text-align: center;
`

const Betting = styled(Box)`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`

const Outcome = styled(Box)`
  text-align: center;
`

const renderSide = (side: number, filled: boolean, color: string) => {
  if (side === 1) {
    if (filled) {
      return <GiDiceSixFacesOne size="32px" color={color} />
    }
    return <GiInvertedDice1 size="32px" color={color} />
  }
  if (side === 2) {
    if (filled) {
      return <GiDiceSixFacesTwo size="32px" color={color} />
    }
    return <GiInvertedDice2 size="32px" color={color} />
  }
  if (side === 3) {
    if (filled) {
      return <GiDiceSixFacesThree size="32px" color={color} />
    }
    return <GiInvertedDice3 size="32px" color={color} />
  }
  if (side === 4) {
    if (filled) {
      return <GiDiceSixFacesFour size="32px" color={color} />
    }
    return <GiInvertedDice4 size="32px" color={color} />
  }
  if (side === 5) {
    if (filled) {
      return <GiDiceSixFacesFive size="32px" color={color} />
    }
    return <GiInvertedDice5 size="32px" color={color} />
  }
  if (side === 6) {
    if (filled) {
      return <GiDiceSixFacesSix size="32px" color={color} />
    }
    return <GiInvertedDice6 size="32px" color={color} />
  }
  return null
}

const HistoryRow: React.FC<HistoryRowProps> = ({ id, bets, outcome }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const { theme } = useTheme()
  
  return (
    <StyledFlex>
      <RowNo>
        <Text fontSize="16px" bold color="primary">#</Text>
        <Text fontSize="24px" bold color="textSubtle">{id}</Text>
      </RowNo>
      <Betting>
        <Text fontSize="16px" bold color="primary">Betting</Text>
        <Flex>
          {[1, 2, 3, 4, 5, 6].map((side, index) => (
            <Box key={index.toString()} style={{ flex: 1 }}>
              {renderSide(side, bets.includes(side), theme.colors[bets.includes(side) ? 'primary' : 'textSubtle'])}
            </Box>
          ))}
        </Flex>
      </Betting>
      <Outcome>
        <Text fontSize="16px" bold color="primary">Outcome</Text>
        <Flex alignItems="center">
          {renderSide(outcome, true, theme.colors[bets.includes(outcome) ? 'success' : 'failure'])}
          <Text
            fontSize="16px"
            bold
            color={bets.includes(outcome) ? 'success' : 'failure'}
            display="inline-block"
            width="64px"
          >
            {bets.includes(outcome) ? 'WIN' : 'LOSS'}
          </Text>
        </Flex>
      </Outcome>
    </StyledFlex>
  )
}

export default HistoryRow
