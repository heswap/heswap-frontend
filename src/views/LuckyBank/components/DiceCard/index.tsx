import BigNumber from 'bignumber.js'
import React from 'react'
import { CardBody, Flex, Text } from '@heswap/uikit'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Dice } from 'state/types'
import { StyledCard, StyledCardInner } from './StyledCard'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const DiceCard: React.FC<{ dice: Dice; account: string; referrer: string }> = ({ dice, account, referrer }) => {
  const { depositToken, diceToken, userData } = dice
  const { t } = useTranslation()
  const withdrawableAmount = userData?.withdrawableAmount ? new BigNumber(userData.withdrawableAmount) : BIG_ZERO

  return (
    <StyledCard>
      <StyledCardInner>
        <StyledCardHeader depositTokenSymbol={depositToken.symbol} diceTokenSymbol={diceToken.symbol} />
        <CardBody>
          <Flex mt="24px" flexDirection="column">
            {account ? (
              <CardActions dice={dice} withdrawableAmount={withdrawableAmount} referrer={referrer} />
            ) : (
              <>
                <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                  {t('Get Dices')}
                </Text>
                <UnlockButton />
              </>
            )}
          </Flex>
          {/* <AprRow pool={pool} /> */}
          {withdrawableAmount.gt(0) && (
            <Flex alignItems="center" justifyContent="space-between">
              <Text>Profit Rate</Text>
              <Text>{userData.profitRate}%</Text>
            </Flex>
          )}
        </CardBody>
      </StyledCardInner>
    </StyledCard>
  )
}

export default DiceCard
