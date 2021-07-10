import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from '@heswap/uikit'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(235deg, rgb(51, 111, 245) 4.05%, rgba(17, 81, 225, 0.32) 103.52%);
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
  transition: opacity 200ms;
  &:hover {
    opacity: 0.65;
  }
`

const CardMidContent = styled(Heading).attrs({
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.warning};
  line-height: 44px;
`
const WinCard = () => {
  const { t } = useTranslation()

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/lottery" id="lottery-pot-cta">
        <CardBody>
          <Heading color="backgroundAlt" scale="lg">
            {t('Lottery')}
          </Heading>
          <CardMidContent>{t('Coming Soon')}</CardMidContent>
          <Flex justifyContent="space-between">
            <Heading color="backgroundAlt" scale="lg" />
            <ArrowForwardIcon mt={30} color="success" />
          </Flex>
        </CardBody>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default WinCard
