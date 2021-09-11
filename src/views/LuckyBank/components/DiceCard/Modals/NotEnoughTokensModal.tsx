import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Modal, Text, Button } from '@heswap/uikit'
import { BASE_EXCHANGE_URL } from 'config'
import useTheme from 'hooks/useTheme'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Modal
      title={t('%symbol% required', { symbol: tokenSymbol })}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Text color="failure" bold mt="8px">
        {t('Insufficient %symbol% balance', { symbol: tokenSymbol })}
      </Text>
      <Text mt="24px">{t('You’ll need %symbol% to deposit and get the dice!', { symbol: tokenSymbol })}</Text>
      <Text>
        {t('Buy some %symbol%, get the dice and enjoy LuckyChip.', {
          symbol: tokenSymbol,
        })}
      </Text>
      <Button mt="24px" as="a" external href={BASE_EXCHANGE_URL}>
        {t('Buy')} {tokenSymbol}
      </Button>
      <Button variant="text" onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </Modal>
  )
}

export default NotEnoughTokensModal
