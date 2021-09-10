import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, AutoRenewIcon, Skeleton } from '@heswap/uikit'
import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import { updateDiceAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import { useBtcbContract, useBusdContract, useETHContract, useLCContract, useWbnbContract } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { Dice } from 'state/types'
import useToast from 'hooks/useToast'

interface ApprovalActionProps {
  dice: Dice
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ dice, isLoading = false }) => {
  const { diceId, depositToken, contractAddress } = dice
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const wbnbContract = useWbnbContract()
  const busdContract = useBusdContract()
  const btcbContract = useBtcbContract()
  const ethContract = useETHContract()
  const lcContract = useLCContract()

  let depositTokenContract
  switch (depositToken.symbol) {
    case 'WBNB':
      depositTokenContract = wbnbContract
      break
    case 'LC':
      depositTokenContract = lcContract
      break
    case 'ETH':
      depositTokenContract = ethContract
      break
    case 'BUSD':
      depositTokenContract = busdContract
      break
    case 'BTCB':
      depositTokenContract = btcbContract
      break
    default:
      depositTokenContract = wbnbContract
      break
  }

  const handleApprove = async () => {
    try {
      setRequestedApproval(true)
      const tx = await depositTokenContract.approve(getAddress(contractAddress), ethers.constants.MaxUint256)
      await tx.wait()
      dispatch(updateDiceAllowance(diceId, account))
      if (tx) {
        toastSuccess(t('Contract Enabled'), t('You can now deposit the %symbol%!', { symbol: depositToken.symbol }))
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

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={requestedApproval}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={requestedApproval}
          onClick={handleApprove}
          width="100%"
        >
          {t('Enable')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
