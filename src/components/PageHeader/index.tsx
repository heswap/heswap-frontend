import React from 'react'
import styled from 'styled-components'
import { Box } from '@heswap/uikit'
import Container from '../layout/Container'

const Inner = styled(Container)`
  padding-top: 96px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<{ background?: string }> = ({ background, children, ...props }) => (
  <Box
    background={background}
    backgroundImage={`url(${process.env.PUBLIC_URL}/images/luckychip-banner.png)`}
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
    backgroundSize="cover"
    {...props}
  >
    <Inner>{children}</Inner>
  </Box>
)

export default PageHeader
