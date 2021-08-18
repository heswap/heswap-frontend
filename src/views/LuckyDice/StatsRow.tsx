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
import { StatsRowProps } from './types'

const StyledFlex = styled(Flex)`
  padding-top: 8px;
  padding-bottom: 8px;
`

const StatsRow: React.FC<StatsRowProps> = ({ color, label, scores }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints()
  const { theme } = useTheme()

  const renderSide = (side: number, filled: boolean, clr: string) => {
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
      return React.createElement(filled ? GiDiceSixFacesOne : GiInvertedDice1, { size, color: clr })
    }
    if (side === 2) {
      return React.createElement(filled ? GiDiceSixFacesTwo : GiInvertedDice2, { size, color: clr })
    }
    if (side === 3) {
      return React.createElement(filled ? GiDiceSixFacesThree : GiInvertedDice3, { size, color: clr })
    }
    if (side === 4) {
      return React.createElement(filled ? GiDiceSixFacesFour : GiInvertedDice4, { size, color: clr })
    }
    if (side === 5) {
      return React.createElement(filled ? GiDiceSixFacesFive : GiInvertedDice5, { size, color: clr })
    }
    if (side === 6) {
      return React.createElement(filled ? GiDiceSixFacesSix : GiInvertedDice6, { size, color: clr })
    }
    return null
  }
  
  return (
    <StyledFlex>
      <div style={{ textAlign: 'center', width: '100px' }}>
        <Text fontSize="16px" bold style={{ color }}>{label}</Text>
      </div>
      <Box mx={['8px', '16px', '32px', '64px', '128px']} style={{ flex: 1 }}>
        <Flex justifyContent="space-evenly">
          {scores.map((score, index) => (
            <Box key={index.toString()} style={{ flex: 1 }}>
              <Text fontSize="24px" bold textAlign="center" style={{ color }}>{score}</Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </StyledFlex>
  )
}

export default StatsRow
