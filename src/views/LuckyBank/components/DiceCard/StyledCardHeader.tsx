import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@heswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled(CardHeader)<{ background?: string }>`
  background: ${({ background, theme }) => theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  diceTokenSymbol: string
  depositTokenSymbol: string
}> = ({ diceTokenSymbol, depositTokenSymbol }) => {
  const { t } = useTranslation()
  const diceImageSrc = `${depositTokenSymbol}-dice.png`.toLocaleLowerCase()
  const background = 'cardHeader'

  const getSubHeading = () => {
    return t('Deposit %deposit%, Get %symbol% Dice', { deposit: depositTokenSymbol, symbol: diceTokenSymbol })
  }

  return (
    <Wrapper background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column" mr="24px">
          <Heading color="body" scale="lg">
            {`${diceTokenSymbol} DICE`}
          </Heading>
          <Text color="textSubtle">{getSubHeading()}</Text>
        </Flex>
        <Image
          src={`${process.env.PUBLIC_URL}/images/bank/${diceImageSrc}`}
          alt={diceTokenSymbol}
          width={64}
          height={64}
        />
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
