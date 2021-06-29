import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Text } from '@heswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import CopyToClipboard from './CopyToClipboard'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('/images/cake-bg.svg');
  background-repeat: no-repeat;
  background-position: top right;
`

const Block = styled.div`
  margin-bottom: 16px;
`

interface LinkCard {
  invite: string
  header: string
}

const GetReferralLinkCard = ({ invite, header }: LinkCard) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading scale="xl" mb="24px">
          {t(header)}
        </Heading>
        <Block>
          <Text
            fontSize="16px"
            bold
            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}
          >
            {`${window.location.protocol}//${window.location.host}/${invite}?ref=${account}`}
          </Text>
        </Block>
        <CopyToClipboard toCopy={`${window.location.protocol}//${window.location.host}/${invite}?ref=${account}`}>
          Copy
        </CopyToClipboard>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default GetReferralLinkCard
