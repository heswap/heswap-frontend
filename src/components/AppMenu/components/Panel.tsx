import React from 'react'
import styled from 'styled-components'
import { SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from '../config'
import Logo from './Logo'
import PanelBody from './PanelBody'
import PanelFooter from './PanelFooter'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  logoTitle?: string
  isMobile: boolean
}

const StyledPanel = styled.div<{ isPushed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.menu.leftBarBody};
  width: ${({ isPushed }) => (isPushed ? `${SIDEBAR_WIDTH_FULL}px` : 0)};
  height: 100%;
  transition: padding-top 0.2s, width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: ${({ isPushed, theme }) => (isPushed ? `2px solid ${theme.menu.border}` : 'none')};
  z-index: ${({ theme }) => theme.zIndices.leftBar};
  overflow: ${({ isPushed }) => (isPushed ? 'initial' : 'hidden')};
  transform: translate3d(0, 0, 0);
  ${({ isPushed }) => !isPushed && 'white-space: nowrap;'};

  ${({ theme }) => theme.mediaQueries.nav} {
    border-right: 2px solid ${({ theme }) => theme.menu.border};
    width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
`

const Panel: React.FC<Props> = (props) => {
  const { logoTitle, isPushed, links } = props

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')

  return (
    <StyledPanel isPushed={isPushed}>
      <Logo
        logoTitle={logoTitle}
        isPushed={isPushed}
        href={homeLink?.href ?? '/'}
      />
      <PanelBody {...props} />
      <PanelFooter {...props} />
    </StyledPanel>
  )
}

export default Panel
