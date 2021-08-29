import React from 'react'
import styled from 'styled-components'
import { Button, Login, useWalletModal } from '@heswap/uikit'

interface Props {
  account?: string
  login: Login
  logout: () => void
}

const StyledButton = styled(Button)`
  align-items: center;
  border: none;
  border-radius: 8px;
  box-shadow: rgb(14 14 44 / 40%) 0px -1px 0px 0px inset;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  opacity: 1;
  outline: 0px;
  padding: 0px 16px;
  transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
`

const UserBlock: React.FC<Props> = ({ account, login, logout }) => {
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account)
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  return (
    <div>
      {account ? (
        <StyledButton
          scale="sm"
          variant="tertiary"
          onClick={() => {
            onPresentAccountModal()
          }}
        >
          {accountEllipsis}
        </StyledButton>
      ) : (
        <StyledButton
          scale="sm"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          Connect wallet
        </StyledButton>
      )}
    </div>
  )
}

export default React.memo(
  UserBlock,
  (prevProps, nextProps) =>
    prevProps.account === nextProps.account &&
    prevProps.login === nextProps.login &&
    prevProps.logout === nextProps.logout
)
