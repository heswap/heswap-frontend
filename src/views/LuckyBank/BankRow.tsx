import React from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { Box, Button, Grid, Text, TokenPairImage } from '@heswap/uikit'
import { Token } from 'config/constants/types'
import { BankRowProps } from './types'

const GridLayout = styled(Grid)`
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 16px;
  align-items: center;
`

function getIconPath(token: Token): string {
  if (token.symbol === 'DICE') {
    return `${process.env.PUBLIC_URL}/images/cake.svg`
  }
  if (token.symbol === 'LC') {
    return `${process.env.PUBLIC_URL}/images/luckychip-token2.png`
  }
  return `${process.env.PUBLIC_URL}/images/tokens/${token.symbol.toLowerCase()}.png`
}

const BankRow: React.FC<BankRowProps> = ({ stakingToken, earningToken, stakingBalance, earningBalance, onDeposit, onWithdraw }) => {
  return (
    <Box p="8px 0" role="row">
      <GridLayout>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TokenPairImage
            primarySrc={getIconPath(stakingToken)}
            secondarySrc={getIconPath(earningToken)}
            width={48}
            height={48}
            title={`${stakingToken.symbol} - ${earningToken.symbol}`}
            m="10px"
          />
        </div>
        <div>
          <Text>{stakingToken.symbol}</Text>
          <Text>{ethers.utils.formatEther(stakingBalance)}</Text>
        </div>
        <div>
          <Text>{earningToken.symbol}</Text>
          <Text>{ethers.utils.formatEther(earningBalance)}</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button variant="secondary" onClick={onDeposit} >Deposit</Button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button variant="secondary" onClick={onWithdraw}>Withdraw</Button>
        </div>
      </GridLayout>
    </Box>
  )
}

export default BankRow
