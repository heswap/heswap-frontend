import React from 'react'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { ArrowForwardIcon, Box, Card, CardBody, Flex, Heading } from '@heswap/uikit'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'
import { Pool } from 'state/types'
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

const activeNonCakePools = pools.filter((pool) => !pool.isFinished && !pool.earningToken.symbol.includes('CAKE'))
const latestPools: Pool[] = orderBy(activeNonCakePools, ['sortOrder', 'pid'], ['desc', 'desc']).slice(0, 3)
// Always include CAKE
const assets = ['CAKE', ...latestPools.map((pool) => pool.earningToken.symbol)].join(', ')

const EarnAssetCard = () => {
  const { t } = useTranslation()
  const assetText = t('Earn %assets% in Pools', { assets })
  const [earn, InPools] = assetText.split(assets)

  return (
    <StyledFarmStakingCard>
      <NavLink exact activeClassName="active" to="/syrup" id="pool-cta">
        <Box background={elevations.dp06}>
          <CardBody>
            <Heading color="backgroundAlt" scale="lg">
              {earn}
            </Heading>
            <CardMidContent>{assets}</CardMidContent>
            <Flex justifyContent="space-between">
              <Heading color="backgroundAlt" scale="lg">
                {InPools}
              </Heading>
              <ArrowForwardIcon mt={30} color="warning" />
            </Flex>
          </CardBody>
        </Box>
      </NavLink>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
