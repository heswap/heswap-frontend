import React from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import Slider from 'views/Home/components/Slider'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'
import useTheme from 'hooks/useTheme'

const Hero = styled.div`
  padding: 96px 32px 48px 32px;
  margin: 0 auto;
  max-width: 1200px;
  border: none;
`

const Banner = styled.div`
  align-items: center;
  // background-image: url('${process.env.PUBLIC_URL}/images/pan-bg-mobile.svg');
  // background-repeat: no-repeat;
  // background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  text-align: center;
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

const Title = styled(Heading).attrs({
  as: 'h1',
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.backgroundAlt};
  font-weight: 600;
  line-height: 1.4;
`

const Description = styled(Heading).attrs({
  as: 'h2',
  scale: 'md',
  color: 'textSubtle',
})`
  font-weight: 300;
  line-height: 1.4;
`

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <>
      <div style={{ background: theme.pageHeader.background }}>
        <Hero>
          <Banner>
            <Title mb="8px">{t('LuckyChip')}</Title>
            <Description>{t('The best of its kind on chain. Invite friends through refer system')}</Description>
          </Banner>
          <Slider>
            <FarmStakingCard />
            <FarmStakingCard />
          </Slider>
        </Hero>
      </div>
      <Page>
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
    </>
  )
}

export default Home
