import React from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading } from '@heswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import useTheme from 'hooks/useTheme'
import GetReferralLinkCard from './components/GetReferralLinkCard'
import ReferralDashboard from './components/ReferralDashboard'
import UnlockCard from './components/UnlockCard'

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 24px;
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
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 6;
    }
  }
`

const Newcards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  grid-gap: 24px;
  text-align: center;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

const Hero = styled.div`
  padding: 96px 32px 48px 32px;
  margin: 0 auto;
  max-width: 1200px;
  border: none;
`

const Banner = styled.div`
  align-items: center;
  background-image: url('${process.env.PUBLIC_URL}/images/pan-bg-mobile.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('${process.env.PUBLIC_URL}/images/pan-bg2.svg'), url('${process.env.PUBLIC_URL}/images/pan-bg.svg');
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
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

const Referrals: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  return (
    <>
      <div style={{ background: theme.pageHeader.background }}>
        <Hero>
          <Banner>
            <Title mb="24px">{t('Invite Your Friends. Earn Cryptocurrency Together.')}</Title>
            <Description>{t('Earn a certain commission reward from your friends swaps on LuckyChip.')}</Description>
          </Banner>
        </Hero>
      </div>
      <Page>
        {account ? (
          <>
            <Cards>
              <GetReferralLinkCard invite="farms" header="Invite your friends to farm" />
              <GetReferralLinkCard invite="pools" header="Invite your friends to pool" />
            </Cards>
            <Newcards>
              <ReferralDashboard />
            </Newcards>
          </>
        ) : (
          <Newcards>
            <UnlockCard />
          </Newcards>
        )}
      </Page>
    </>
  )
}

export default Referrals
