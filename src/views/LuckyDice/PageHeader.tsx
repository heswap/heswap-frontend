import React from 'react'
import styled from 'styled-components'
import { Box } from '@heswap/uikit'
import Container from '../../components/layout/Container'

const Outer = styled(Box)<{ background?: string }>`
  background: ${({ theme, background }) => background || theme.pageHeader.background};
`

const Inner = styled(Container)`
  padding-bottom: 160px;
`

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
