import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex, Text, Button, useModal, Skeleton, Box, AutoRenewIcon } from '@heswap/uikit'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { BIG_ZERO } from 'utils/bigNumber'
import { Dice } from 'state/types'
import useToast from 'hooks/useToast'
import { useDiceTokenContract } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { updateDiceTokenAllowance } from 'state/dices'
import DepositModal from '../Modals/DepositModal'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'

const InlineText = styled(Text)`
  display: inline;
`

interface DepositActionsProps {
  dice: Dice
  depositTokenBalance: BigNumber
  withdrawableAmount: BigNumber
  isDeposited: ConstrainBoolean
  referrer: string
  isLoading?: boolean
}

const DepositActions: React.FC<DepositActionsProps> = ({
  dice,
  depositTokenBalance,
  withdrawableAmount,
  isDeposited,
  referrer,
  isLoading = false,
}) => {
  const { diceId, depositToken, userData, paused, diceToken, contractAddress } = dice
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const diceTokenContract = useDiceTokenContract(depositToken.symbol)
  const { t } = useTranslation()
  const diceAllowance = userData?.diceAllowance ? new BigNumber(userData.diceAllowance) : BIG_ZERO
  const needsDiceApproval = !diceAllowance.gt(0)

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={depositToken.symbol} />)

  const [onPresentDeposit] = useModal(
    <DepositModal dice={dice} depositTokenBalance={depositTokenBalance} referrer={referrer} />,
  )

  const [onPresentWithdraw] = useModal(
    <DepositModal depositTokenBalance={depositTokenBalance} dice={dice} referrer={referrer} isWithdrawing />,
  )

  const handleDiceApprove = async () => {
    try {
      setRequestedApproval(true)
      const tx = await diceTokenContract.approve(getAddress(contractAddress), ethers.constants.MaxUint256)
      await tx.wait()
      dispatch(updateDiceTokenAllowance(diceId, account))
      if (tx) {
        toastSuccess(t('Contract Enabled'), t('You can now withdraw the %symbol%!', { symbol: diceToken.symbol }))
        setTimeout(() => {
          setRequestedApproval(false)
        }, 3500)
      } else {
        // user rejected tx or didn't go thru
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        setRequestedApproval(false)
      }
    } catch (e) {
      toastError(t('Error'), e?.message)
      setRequestedApproval(false)
    }
  }

  const renderDepositAction = () => {
    return isDeposited ? (
      <>
        <Button onClick={depositTokenBalance.gt(0) ? onPresentDeposit : onPresentTokenRequired} disabled={!paused}>
          {t('Deposit')}
        </Button>
        <Box display="inline" mt="8px">
          <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
            {`${diceToken.symbol} `}
          </InlineText>
          <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('Available To Withdraw')}
          </InlineText>
        </Box>
        {needsDiceApproval ? (
          <Button
            isLoading={requestedApproval}
            endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={requestedApproval}
            onClick={handleDiceApprove}
            width="100%"
          >
            {t('Enable')}
          </Button>
        ) : (
          <Button onClick={onPresentWithdraw} disabled={!paused || withdrawableAmount.eq(0)}>
            {t('Withdraw')}
          </Button>
        )}
      </>
    ) : (
      <Button onClick={depositTokenBalance.gt(0) ? onPresentDeposit : onPresentTokenRequired} disabled={!paused}>
        {t('Deposit')}
      </Button>
    )
  }

  return (
    <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderDepositAction()}</Flex>
  )
}

export default DepositActions
