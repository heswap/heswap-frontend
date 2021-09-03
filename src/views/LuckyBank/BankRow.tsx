import React from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { Box, Button, Text, TokenPairImage } from '@heswap/uikit'
import { Token } from 'config/constants/types'
import { BankRowProps } from './types'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  padding: 24px 0;
`

function getIconPath(token: Token): string {
  if (token.symbol === 'CAKE') {
    return `${process.env.PUBLIC_URL}/images/cake.svg`
  }
  return `${process.env.PUBLIC_URL}/images/tokens/${token.symbol.toLowerCase()}.png`
}

const BankRow: React.FC<BankRowProps> = ({ stakingToken, earningToken, balance }) => {
  return (
    <StyledRow role="row">
      <TokenPairImage
        primarySrc={getIconPath(stakingToken)}
        secondarySrc={getIconPath(earningToken)}
        width={64}
        height={64}
        title={`${stakingToken.symbol} - ${earningToken.symbol}`}
        m="10px"
      />
      <Text>{stakingToken.symbol} - {earningToken.symbol}</Text>
      <Text>{ethers.utils.formatEther(balance)}</Text>
    </StyledRow>
  )
}

export default BankRow
