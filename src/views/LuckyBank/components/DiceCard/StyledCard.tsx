import styled, { css } from 'styled-components'
import { Card, Box } from '@heswap/uikit'

export const StyledCard = styled(Card)`
  max-width: 352px;
  margin: 0 8px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ theme }) => theme.colors.secondary};
  box-shadow: ${({ theme }) => theme.shadows.step};

  ${({ theme }) =>
    css`
      background: linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary});
      padding: 1px 1px 3px 1px;
      background-size: 400% 400%;
    `}

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export const StyledCardInner = styled(Box)`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
`

export default StyledCard
