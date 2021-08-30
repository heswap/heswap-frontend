import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Card, CardBody, Heading, Image } from '@heswap/uikit'
import { harvest } from 'utils/callHelpers'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { useMasterChef } from 'hooks/useContract'
import UnlockButton from 'components/UnlockButton'
import { elevations } from 'utils/palette'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'

const StyledCard = styled(Card)`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 376px;
`

const BackImage = styled(Image)`
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.25;
  filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  -moz-filter: blur(3px);
  -webkit-filter: blur(3px);
`

const Block = styled.div`
  margin-bottom: 16px;
`

const TokenImage = styled.img`
  border-radius: 50%;
  box-shadow: rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px;
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.backgroundAlt};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const farmsWithBalance = useFarmsWithBalance()
  const masterChefContract = useMasterChef()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const farmWithBalance of balancesWithValue) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await harvest(masterChefContract, farmWithBalance.pid, account)
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      }
    }
    setPendingTx(false)
  }, [account, balancesWithValue, masterChefContract])

  return (
    <StyledCard>
      <Box background={elevations.dp04}>
        <CardBody>
          <BackImage src={`${process.env.PUBLIC_URL}/images/luckychip-heap.png`} alt="" width={222} height={341} />
          <Box position="relative">
            <Heading scale="xl" mb="24px" color="backgroundAlt">
              {t('Farms & Staking')}
            </Heading>
            <TokenImage src={`${process.env.PUBLIC_URL}/images/luckychip-token2.png`} alt="cake logo" width={64} height={64} />
            <Block>
              <Label>{t('CAKE to Harvest')}:</Label>
              <CakeHarvestBalance />
            </Block>
            <Block>
              <Label>{t('CAKE in Wallet')}:</Label>
              <CakeWalletBalance />
            </Block>
            <Actions>
              {account ? (
                <Button
                  id="harvest-all"
                  disabled={balancesWithValue.length <= 0 || pendingTx}
                  onClick={harvestAllFarms}
                  width="100%"
                >
                  {pendingTx ? t('Collecting CAKE') : t('Harvest all (%count%)', { count: balancesWithValue.length })}
                </Button>
              ) : (
                <UnlockButton width="100%" />
              )}
            </Actions>
          </Box>
        </CardBody>
      </Box>
    </StyledCard>
  )
}

export default FarmStakingCard
