import React from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Box, Card, CardBody, Flex, Heading } from '@heswap/uikit'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { elevations } from 'utils/palette'

const StyledFarmStakingCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
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
        <Box background={elevations.dp06}>
          <CardBody>
            <Heading color="backgroundAlt" scale="lg">
              {t('Lottery')}
            </Heading>
            <CardMidContent>{t('Coming Soon')}</CardMidContent>
            <Flex justifyContent="space-between">
              <Heading color="backgroundAlt" scale="lg" />
              <ArrowForwardIcon mt={30} color="warning" />
            </Flex>
          </CardBody>
        </Box>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default WinCard
