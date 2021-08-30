import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('${process.env.PUBLIC_URL}/images/cake-bg.svg');
  background-repeat: no-repeat;
  background-position: top right;
`

const Block = styled.div`
  margin: 16px 0;
`

const UnlockCard = () => {
  const { t } = useTranslation()

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Block>
          <UnlockButton />
        </Block>
        <Block>
          <Text>{t('Unlock wallet to get your unique referral link')}</Text>
        </Block>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default UnlockCard
