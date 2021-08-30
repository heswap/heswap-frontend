import React from 'react'
import styled, { useTheme } from 'styled-components'
import { AutoRenewIcon, Text } from '@heswap/uikit'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {}

const Container = styled.div`
  flex: none;
  margin: 32px 16px;
  border-radius: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.menu.leftBarFooter};
  border-top: ${({ theme }) => `solid 2px ${theme.menu.border}`};
`

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
`

const IconWrapper = styled.div`
  margin-right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: ${({ theme}) => theme.colors.success};
`

const PanelFooter: React.FC<Props> = ({
  isPushed
}) => {
  const theme = useTheme()
  return (
    <Container style={{
      display: isPushed ? 'block' : 'none'
    }}>
      <Text color={theme.colors.backgroundAlt} marginBottom="12px">Live Trading Deals</Text>
      <RowWrapper style={{ marginBottom: '16px' }}>
        <IconWrapper>
          <AutoRenewIcon color={theme.colors.backgroundAlt} />
        </IconWrapper>
        <div style={{ flex: 1 }}>
          <Text small color={theme.colors.backgroundAlt}>Swap</Text>
          <Text small color={theme.colors.textSubtle}>10:15:16 PM</Text>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <Text small color={theme.colors.backgroundAlt}>USD/BTC</Text>
          <Text small color={theme.colors.success}>$2,198.35</Text>
        </div>
      </RowWrapper>
      <RowWrapper>
        <IconWrapper>
          <AutoRenewIcon color={theme.colors.backgroundAlt} />
        </IconWrapper>
        <div style={{ flex: 1 }}>
          <Text small color={theme.colors.backgroundAlt}>Swap</Text>
          <Text small color={theme.colors.textSubtle}>10:15:16 PM</Text>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <Text small color={theme.colors.backgroundAlt}>USD/BTC</Text>
          <Text small color={theme.colors.success}>$2,198.35</Text>
        </div>
      </RowWrapper>
    </Container>
  )
}

export default PanelFooter
