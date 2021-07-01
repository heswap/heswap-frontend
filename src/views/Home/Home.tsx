import React, { useState } from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading, IconButton } from '@heswap/uikit'
import Carousel, { Dots, arrowsPlugin, autoplayPlugin } from '@brainhubeu/react-carousel'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'

const Hero = styled.div`
  padding-top: 32px;
  padding-bottom: 32px;
  padding-right: 24px;
  padding-left: 24px;
  margin-top: 0;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  max-width: 1200px;
  border: none;
`

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

const Title = styled(Heading)`
  color: #fff;
  font-weight: 600;
  line-height: 1.4;
`

const Description = styled(Heading)`
  color: #749bd8;
  font-weight: 300;
  line-height: 1.4;
`

const CarouselThumb = styled.div`
  width: 18px;
  height: 6px;
  border-radius: 3px;
  background-color: #fff;
`

const Home: React.FC = () => {
  const { t } = useTranslation()
  const [activeSlide, setActiveSlide] = useState(0)
  const [slides, setSlides] = useState([
    <FarmStakingCard />,
    <FarmStakingCard />
  ])
  const [thumbs, setThumbs] = useState([
    <CarouselThumb />,
    <CarouselThumb />
  ])

  return (
    <div>
      <div style={{ background: 'linear-gradient(180deg, #071c3c, #002b6f)', marginTop: '-64px' }}>
        <Hero>
          <Banner>
            <Title as="h1" scale="xl" mb="8px">
              {t('HeSwap')}
            </Title>
            <Description as="h2" scale="md">
              {t('The best of its kind on chain. Invite friends through refer system')}
            </Description>
          </Banner>
          <div>
            <Carousel
              plugins={[
                'infinite',
                {
                  resolve: arrowsPlugin,
                  options: {
                    arrowLeft: <IconButton><FaArrowLeft /></IconButton>,
                    arrowLeftDisabled: <IconButton><FaArrowLeft /></IconButton>,
                    arrowRight: <IconButton><FaArrowRight /></IconButton>,
                    arrowRightDisabled: <IconButton><FaArrowRight /></IconButton>,
                    addArrowClickHandler: true
                  }
                },
                {
                  resolve: autoplayPlugin,
                  options: {
                    interval: 2000
                  }
                }
              ]}
              value={activeSlide}
              slides={slides}
              onChange={value => setActiveSlide(value)}
            />
            <Dots
              number={slides.length}
              value={activeSlide}
              onChange={value => setActiveSlide(value)}
              thumbnails={thumbs}
            />
          </div>
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
    </div>
  )
}

export default Home
