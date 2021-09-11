import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Box, Flex, Heading, Image } from '@heswap/uikit'
import 'moment-duration-format'
import { useTranslation } from 'contexts/Localization'
import { useDices } from 'state/hooks'
import { isAddress } from 'utils/addressHelpers'
import { AddressZero } from '@ethersproject/constants'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import DiceCard from './components/DiceCard'
import HelpButton from './components/HelpButton'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const Title = styled(Heading).attrs({
  as: 'h1',
  scale: 'xl',
})`
  color: ${({ theme }) => theme.colors.backgroundAlt};
  font-weight: 600;
  line-height: 1.4;
`

const Description = styled(Heading).attrs({
  as: 'h2',
  scale: 'md',
  color: 'textSubtle',
})`
  font-weight: 300;
  line-height: 1.4;
`

const LuckyBank: React.FC = () => {
  const location = useLocation()
  let referrer = AddressZero
  if (location.pathname.substring(7) && isAddress(location.pathname.substring(7))) {
    referrer = location.pathname.substring(7)
    // console.log(`referral link, ref=${referrer}`)
  } else {
    // console.log('not referral link')
  }

  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { dices } = useDices(account)

  // usePollDicesData()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']} position="relative">
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Title mb="24px">{t('Lucky Bank')}</Title>
            <Description>{t('Just depost some tokens to get dice.')}</Description>
            <Description>{t('High Profit, low risk.')}</Description>
          </Flex>
          <Image src={`${process.env.PUBLIC_URL}/images/luckychip-card.png`} alt="" width={360} height={180} />
          <Box position="absolute" top={32} right={32}>
            <HelpButton />
          </Box>
        </Flex>
      </PageHeader>
      <Page>
        <CardLayout>
          {dices.map((dice) => (
            <DiceCard key={dice.diceId} dice={dice} account={account} referrer={referrer} />
          ))}
        </CardLayout>
        <Image
          mx="auto"
          mt="12px"
          src={`${process.env.PUBLIC_URL}/images/3d-syrup-bunnies.png`}
          alt="Pancake illustration"
          width={192}
          height={184.5}
        />
      </Page>
    </>
  )
}

export default LuckyBank
