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

const Outcome = styled(Box)`
  text-align: center;

  > ${Flex} {
    width: 88px;

    ${({ theme }) => theme.mediaQueries.sm} {
      width: 96px;
    }

    > ${Text} {
      flex: 1;
    }
  }
`

const HistoryRow: React.FC<HistoryRowProps> = ({ id, bets, outcome }) => {
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
  
  return (
    <StyledFlex>
      <div style={{ textAlign: 'center' }}>
        <Text fontSize="16px" bold color="primary">#</Text>
        <Text fontSize="24px" bold color="textSubtle" width="40px">{id}</Text>
      </div>
      <Box mx={['8px', '16px', '32px', '64px', '128px']} style={{ flex: 1 }}>
        <Text fontSize="16px" bold color="primary">Betting</Text>
        <Flex justifyContent="space-between">
          {[1, 2, 3, 4, 5, 6].map((side, index) => (
            <Box key={index.toString()}>
              {renderSide(side, bets.includes(side), theme.colors[bets.includes(side) ? 'primary' : 'textSubtle'])}
            </Box>
          ))}
        </Flex>
      </Box>
      <Outcome>
        <Text fontSize="16px" bold color="primary">Outcome</Text>
        <Flex alignItems="center">
          {renderSide(outcome, true, theme.colors[bets.includes(outcome) ? 'success' : 'failure'])}
          <Text
            fontSize="16px"
            bold
            color={bets.includes(outcome) ? 'success' : 'failure'}
            display="inline-block"
          >
            {bets.includes(outcome) ? 'WIN' : 'LOSS'}
          </Text>
        </Flex>
      </Outcome>
    </StyledFlex>
  )
}

export default HistoryRow
