import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { usePriceCakeBusd, useDice } from 'state/hooks'
import { useDiceContract } from 'hooks/useContract'
import { useModal } from '@heswap/uikit'
import Menu from './components/Menu'
import { links } from './config'
import ConfirmationModal from '../ConfirmationModal'

const AppMenu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { currentLanguage, setLanguage, t } = useTranslation()

  const diceContract = useDiceContract()
  const { currentEpoch } = useDice()

  const [onPresentConfirmation] = useModal(
    <ConfirmationModal
      title="Confirm claim"
      description="Are you sure to claim?"
      onConfirm={async () => {
        const tx = await diceContract.claim(currentEpoch)
        const receipt = await tx.wait()
        console.log('claim', receipt.transactionHash)
      }}
    />,
  )

  return (
    <Menu
      logoTitle="LuckyChip"
      account={account}
      claim={onPresentConfirmation}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={links(t)}
      {...props}
    />
  )
}

export default AppMenu
