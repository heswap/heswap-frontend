import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { ethers } from 'ethers'
import { Modal, Text, Flex, Image, Button, Slider, BalanceInput, AutoRenewIcon } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { updateUserDiceData, updateDiceBalance } from 'state/actions'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'
import { Dice } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import { useDiceContract } from 'hooks/useContract'
import PercentageButton from './PercentageButton'

interface DepositModalProps {
  dice: Dice
  depositTokenBalance: BigNumber
  referrer: string
  isWithdrawing?: boolean
  onDismiss?: () => void
}

const DepositModal: React.FC<DepositModalProps> = ({
  dice,
  depositTokenBalance,
  referrer,
  isWithdrawing = false,
  onDismiss,
}) => {
  const { diceId, depositToken, userData, diceToken } = dice
  const { t } = useTranslation()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const diceContract = useDiceContract(depositToken.symbol)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [percent, setPercent] = useState(0)
  const getCalculatedStakingLimit = () => {
    if (isWithdrawing) {
      return userData.withdrawableAmount
    }
    return depositTokenBalance
  }

  const handleDepositInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(
        new BigNumber(input),
        isWithdrawing ? diceToken.decimals : depositToken.decimals,
      )
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber())
      setPercent(Math.min(percentage, 100))
    } else {
      setPercent(0)
    }
    setDepositAmount(input)
  }

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfDepositMax = new BigNumber(getCalculatedStakingLimit())
        .dividedBy(100)
        .multipliedBy(sliderPercent)
      const amountToDeposit = getFullDisplayBalance(
        percentageOfDepositMax,
        isWithdrawing ? diceToken.decimals : depositToken.decimals,
        isWithdrawing ? diceToken.decimals : depositToken.decimals,
      )
      setDepositAmount(amountToDeposit)
    } else {
      setDepositAmount('')
    }
    setPercent(sliderPercent)
  }

  const onStake = async () => {
    const convertedAmount = ethers.utils.parseUnits(depositAmount, depositToken.decimals)
    const tx = await diceContract.deposit(convertedAmount)
    dispatch(updateUserDiceData(diceId, account))
    dispatch(updateDiceBalance(diceId, account))

    return tx
  }

  const onUnstake = async () => {
    const convertedAmount = ethers.utils.parseUnits(depositAmount, diceToken.decimals)
    const tx = await diceContract.withdraw(convertedAmount)
    dispatch(updateUserDiceData(diceId, account))
    dispatch(updateDiceBalance(diceId, account))

    return tx
  }

  const handleConfirmClick = async () => {
    setPendingTx(true)

    if (isWithdrawing) {
      // withdrawing
      try {
        const tx = await onUnstake()
        await tx.wait()
        toastSuccess(
          `${t('Withdrawed')}!`,
          t('Your %symbol% withdrawed and you get back your %deposited%!', {
            symbol: diceToken.symbol,
            deposited: depositToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    } else {
      try {
        // depositing
        const tx = await onStake()
        await tx.wait()
        toastSuccess(
          `${t('Deposited')}!`,
          t('Your %symbol% funds have been deposited and you get %dice% dice!', {
            symbol: depositToken.symbol,
            dice: diceToken.symbol,
          }),
        )
        setPendingTx(false)
        onDismiss()
      } catch (e) {
        toastError(t('Canceled'), t('Please try again and confirm the transaction.'))
        setPendingTx(false)
      }
    }
  }

  return (
    <Modal
      title={isWithdrawing ? t('Withdraw') : t('Deposit')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {isWithdrawing ? (
        <Flex alignItems="center" justifyContent="space-between" mb="8px" mt="8px">
          <Text bold>{t('Withdraw')}:</Text>
          <Flex alignItems="center" minWidth="70px">
            <Image
              src={`${process.env.PUBLIC_URL}/images/tokens/${getAddress(diceToken.address)}.png`}
              width={24}
              height={24}
              alt={diceToken.symbol}
            />
            <Text ml="4px" bold>
              {diceToken.symbol}
            </Text>
          </Flex>
        </Flex>
      ) : (
        <Flex alignItems="center" justifyContent="space-between" mb="8px" mt="8px">
          <Text bold>{t('Deposit')}:</Text>
          <Flex alignItems="center" minWidth="70px">
            <Image
              src={`${process.env.PUBLIC_URL}/images/tokens/${getAddress(depositToken.address)}.png`}
              width={24}
              height={24}
              alt={depositToken.symbol}
            />
            <Text ml="4px" bold>
              {depositToken.symbol}
            </Text>
          </Flex>
        </Flex>
      )}
      <BalanceInput
        value={depositAmount}
        onUserInput={handleDepositInputChange}
        decimals={isWithdrawing ? diceToken.decimals : depositToken.decimals}
      />
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t('Balance: %balance%', {
          balance: getFullDisplayBalance(
            getCalculatedStakingLimit(),
            isWithdrawing ? diceToken.decimals : depositToken.decimals,
          ),
        })}
      </Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(100)}>{t('Max')}</PercentageButton>
      </Flex>
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!depositAmount || parseFloat(depositAmount) === 0}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
    </Modal>
  )
}

export default DepositModal
