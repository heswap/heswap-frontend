import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@heswap/uikit'
import { harvest } from 'utils/callHelpers'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { useMasterChef } from 'hooks/useContract'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'

const StyledCard = styled(Card)`
  display: inline-block;
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
  min-height: 376px;
`

const StyledCardBody = styled(CardBody)`
  background-image: url('${process.env.PUBLIC_URL}/images/cake-bg.svg');
  background-repeat: no-repeat;
  background-position: top right;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.backgroundAlt};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard = () => {
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
      <StyledCardBody>
        <Heading scale="xl" mb="24px" color="backgroundAlt">
          {t('Farms & Staking')}
        </Heading>
        <CardImage src={`${process.env.PUBLIC_URL}/images/cake.svg`} alt="cake logo" width={64} height={64} />
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
      </StyledCardBody>
    </StyledCard>
  )
}

export default FarmedStakingCard
