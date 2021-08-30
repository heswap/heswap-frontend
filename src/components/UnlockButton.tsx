import React from 'react'
import styled from 'styled-components'
import { Button, useWalletModal } from '@heswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)`
  border-radius: 8px;
`

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <StyledButton onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </StyledButton>
  )
}

export default UnlockButton
