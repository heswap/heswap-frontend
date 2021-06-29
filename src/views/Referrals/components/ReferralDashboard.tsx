import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Text } from '@heswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'

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
  
  return (
    <>
        <Card>
            <CardBody>
                <Heading scale="xl" mb="24px">
                    {t('Dashboard')}
                </Heading>
                {
                    referrer === `` ? <></>
                    : 
                    <Line>
                        <Text>My Referrer:  {referrer.substring(0, 5)}...{referrer.substring(37)}</Text>
                    </Line>
                }
                <Block>
                    <Unit>
                        <Text fontSize="18px">Total Referrals :  {referrals}</Text>
                    </Unit>
                    <Unit>
                        <Text fontSize="18px">Total Commissions :  {commissions}</Text>
                    </Unit>
                </Block>
            </CardBody>
        </Card>
    </>
  )
}

export default ReferralDashboard
