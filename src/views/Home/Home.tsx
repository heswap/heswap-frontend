import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'

const Hero = styled.div`
  margin-top: -32px;
  margin-right: -24px;
  margin-left: -24px;
  padding-top: 32px;
  padding-right: 24px;
  padding-left: 24px;
  background: linear-gradient(180deg, #071c3c, #002b6f);
`;

const Banner = styled.div`
  align-items: center;
  // background-image: url('/images/pan-bg-mobile.svg');
  // background-repeat: no-repeat;
  // background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    // background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
    // background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  padding-bottom: 24px;
  grid-gap: 24px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-top: 24px;
  margin-bottom: 24px;
  grid-gap: 24px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 4;
    }
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Hero>
        <Banner>
          <Heading as="h1" scale="xl" mb="24px" color="secondary">
            {t('HeSwap')}
          </Heading>
          <Text>{t('The #1 AMM and yield farm on Binance Smart Chain.')}</Text>
        </Banner>
        <Cards>
          <FarmStakingCard />
        </Cards>
      </Hero>
      <CTACards>
        <EarnAPRCard />
        <EarnAssetCard />
        <WinCard />
      </CTACards>
      <Cards>
        <CakeStats />
        <TotalValueLockedCard />
      </Cards>
    </Page>
  )
}

export default Home
