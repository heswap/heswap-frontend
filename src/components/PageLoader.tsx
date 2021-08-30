import React from 'react'
import styled from 'styled-components'
import { Image } from '@heswap/uikit'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Image
        src={`${process.env.PUBLIC_URL}/images/luckychip-logo.gif`}
        alt=""
        width={600}
        height={540}
      />
    </Wrapper>
  )
}

export default PageLoader
