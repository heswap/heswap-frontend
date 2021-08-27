import React from 'react'
import styled from 'styled-components'
import { Box, Card, CardBody, Heading, Skeleton, Text } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import { elevations } from 'utils/palette'

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const { t } = useTranslation()
  const data = useGetStats()
  const tvl = data ? data.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null

  return (
    <StyledCard>
      <Box width="100%" height="100%" background={elevations.dp06}>
        <CardBody>
          <Heading scale="lg" mb="24px" color="primary">
            {t('Total Value Locked (TVL)')}
          </Heading>
          {data ? (
            <>
              <Heading scale="xl">{`$${tvl}`}</Heading>
              <Text color="textSubtle">{t('Across all LPs and Syrup Pools')}</Text>
            </>
          ) : (
            <Skeleton height={66} />
          )}
        </CardBody>
      </Box>
    </StyledCard>
  )
}

export default TotalValueLockedCard
