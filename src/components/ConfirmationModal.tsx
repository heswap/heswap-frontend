import React, { useState } from 'react'
import { Button, Modal, Text } from '@heswap/uikit'
import { grey } from 'utils/palette'
import ModalActions from './ModalActions'

interface ConfirmationModalProps {
  title?: string
  description?: string
  onConfirm: () => void
  onDismiss?: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, description, onConfirm, onDismiss }) => {
  const [pendingTx, setPendingTx] = useState(false)

  return (
    <Modal
      background={`${grey[900]} !important`}
      title={title}
      onDismiss={onDismiss}
    >
      <Text>{description}</Text>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            setPendingTx(true)
            await onConfirm()
            setPendingTx(false)
            onDismiss()
          }}
          width="100%"
          disabled={pendingTx}
        >
          {pendingTx ? 'Pending Confirmation' : 'Confirm'}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default ConfirmationModal
