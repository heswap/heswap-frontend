import React from 'react'
import styled from 'styled-components'
import { Box, Card, CardBody, Heading, Text } from '@heswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { elevations } from 'utils/palette'
import CopyToClipboard from './CopyToClipboard'

const StyledFarmStakingCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
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
      <Box background={elevations.dp06}>
        <Box
          backgroundImage={`url('${process.env.PUBLIC_URL}/images/cake-bg.svg')`}
          backgroundRepeat="no-repeat"
          backgroundPosition="top right"
        >
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
                {`${window.location.protocol}//${window.location.host}/${invite}/${account}`}
              </Text>
            </Block>
            <CopyToClipboard toCopy={`${window.location.protocol}//${window.location.host}/${invite}/${account}`}>
              Copy
            </CopyToClipboard>
          </CardBody>
        </Box>
      </Box>
    </StyledFarmStakingCard>
  )
}

export default GetReferralLinkCard
