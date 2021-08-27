import React from 'react'
import { Box, Card, CardBody, Heading, Text } from '@heswap/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getCakeAddress } from 'utils/addressHelpers'
import { elevations } from 'utils/palette'
import CardValue from './CardValue'

const StyledCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  background-color: ${({ theme }) => theme.colors.background};
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress()))
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  return (
    <StyledCard>
      <Box background={elevations.dp06}>
        <CardBody>
          <Heading scale="xl" mb="24px" color="secondary">
            {t('Cake Stats')}
          </Heading>
          <Row>
            <Text color="primary">{t('Total CAKE Supply')}</Text>
            {cakeSupply && <CardValue color="primary" fontSize="18px" value={cakeSupply} />}
          </Row>
          <Row>
            <Text color="primary">{t('Total CAKE Burned')}</Text>
            <CardValue color="primary" fontSize="18px" decimals={0} value={burnedBalance} />
          </Row>
          <Row>
            <Text color="primary">{t('New CAKE/block')}</Text>
            <CardValue color="primary" fontSize="18px" decimals={0} value={20} />
          </Row>
        </CardBody>
      </Box>
    </StyledCard>
  )
}

export default CakeStats
