import React, { FormEvent, useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Modal } from '@heswap/uikit'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { grey } from 'utils/palette'

interface BetModalProps {
  title?: string
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
}

const BetModal: React.FC<BetModalProps> = ({ title = 'Bet Numbers', max, onConfirm, onDismiss, tokenName = '' }) => {
  const [amount, setAmount] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const amountNum = new BigNumber(amount)
  const fullBalanceNum = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setAmount(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setAmount],
  )

  return (
    <Modal
      background={`${grey[900]} !important`}
      title={title}
      onDismiss={onDismiss}
    >
      <ModalInput value={amount} onChange={handleChange} max={fullBalance} symbol={tokenName} inputTitle="Bet" />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(amount)
            setPendingTx(false)
            onDismiss()
          }}
          width="100%"
          disabled={pendingTx || !amountNum.isFinite() || amountNum.eq(0) || amountNum.gt(fullBalanceNum)}
        >
          {pendingTx ? 'Pending Confirmation' : 'Confirm'}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default BetModal
