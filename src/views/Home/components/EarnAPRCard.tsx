import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ArrowForwardIcon, Box, Card, CardBody, Flex, Heading, Skeleton } from '@heswap/uikit'
import max from 'lodash/max'
import { NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { useFarms, usePriceCakeBusd } from 'state/hooks'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import { elevations } from 'utils/palette'

const StyledCard = styled(Card)`
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
  line-height: 44px;
`

const EarnAPRCard = () => {
  const [isFetchingFarmData, setIsFetchingFarmData] = useState(true)
  const { t } = useTranslation()
  const { data: farmsLP } = useFarms()
  const cakePrice = usePriceCakeBusd()
  const dispatch = useAppDispatch()

  // Fetch farm data once to get the max APR
  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        await dispatch(fetchFarmsPublicDataAsync(nonArchivedFarms.map((nonArchivedFarm) => nonArchivedFarm.pid)))
      } finally {
        setIsFetchingFarmData(false)
      }
    }

    fetchFarmData()
  }, [dispatch, setIsFetchingFarmData])

  const highestApr = useMemo(() => {
    if (cakePrice.gt(0)) {
      const aprs = farmsLP.map((farm) => {
        // Filter inactive farms, because their theoretical APR is super high. In practice, it's 0.
        if (farm.pid !== 0 && farm.multiplier !== '0X' && farm.lpTotalInQuoteToken && farm.quoteToken.busdPrice) {
          const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
          return getFarmApr(new BigNumber(farm.poolWeight), cakePrice, totalLiquidity)
        }
        return null
      })

      const maxApr = max(aprs)
      return maxApr?.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }, [cakePrice, farmsLP])

  const aprText = highestApr || '-'
  const earnAprText = t('Earn up to %highestApr% APR in Farms', { highestApr: aprText })
  const [earnUpTo, InFarms] = earnAprText.split(aprText)

  return (
    <StyledCard>
      <NavLink exact activeClassName="active" to="/farms" id="farm-apr-cta">
        <Box background={elevations.dp06}>
          <CardBody>
            <Heading color="backgroundAlt" scale="lg">
              {earnUpTo}
            </Heading>
            <CardMidContent color="#7645d9">
              {highestApr && !isFetchingFarmData ? (
                `${highestApr}%`
              ) : (
                <Skeleton animation="pulse" variant="rect" height="44px" />
              )}
            </CardMidContent>
            <Flex justifyContent="space-between">
              <Heading color="backgroundAlt" scale="lg">
                {InFarms}
              </Heading>
              <ArrowForwardIcon mt={30} color="warning" />
            </Flex>
          </CardBody>
        </Box>
      </NavLink>
    </StyledCard>
  )
}

export default EarnAPRCard
