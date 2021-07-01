import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'

const StyledCard = styled(Card)`
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
    </StyledCard>
  )
}

export default TotalValueLockedCard
