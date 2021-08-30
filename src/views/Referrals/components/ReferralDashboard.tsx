import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Box, Card, CardBody, Heading, Text } from '@heswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { getReferralContract } from 'utils/contractHelpers'
import { elevations } from 'utils/palette'

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
`

const Block = styled.div`
  margin-bottom: 16px;
  display: flex;
  margin: auto;
`
const Unit = styled.div`
  width: 50%;
`

const Line = styled.div`
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  padding: 5px;
  text-align: center;
  border-radius: 20px;
`

const ReferralDashboard = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const [referrer, setReferrer] = useState(``)
  const [referrals, setReferrals] = useState(0)
  const [commissions, setCommissions] = useState(0)

  useEffect(() => {
    async function fetchReferralsData() {
      const referralsContract = getReferralContract()
      const referrerTemp = await referralsContract.methods.getReferrer(account).call()
      const referralsTemp = await referralsContract.methods.referralsCount(account).call()
      const commissionsTemp = await referralsContract.methods.totalReferralCommissions(account).call()
      setReferrer(referrerTemp)
      setReferrals(referralsTemp)
      setCommissions(commissionsTemp)
    }

    fetchReferralsData()
  }, [account])

  return (
    <StyledCard>
      <Box background={elevations.dp06}>
        <CardBody>
          <Heading scale="xl" mb="24px">
            {t('Dashboard')}
          </Heading>
          {referrer === `` ? (
            <></>
          ) : (
            <Line>
              <Text>
                My Referrer: {referrer.substring(0, 5)}...{referrer.substring(37)}
              </Text>
            </Line>
          )}
          <Block>
            <Unit>
              <Text fontSize="18px">Total Referrals : {referrals}</Text>
            </Unit>
            <Unit>
              <Text fontSize="18px">Total Commissions : {commissions}</Text>
            </Unit>
          </Block>
        </CardBody>
      </Box>
    </StyledCard>
  )
}

export default ReferralDashboard
