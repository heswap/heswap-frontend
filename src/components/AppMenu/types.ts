import { ReactNode } from 'react'
import { Colors, Login } from '@heswap/uikit'

export interface Language {
  code: string
  language: string
  locale: string
}

export interface Profile {
  username?: string
  image?: string
  profileLink: string
  noProfileLink: string
  showPip?: boolean
}

export interface PushedProps {
  isPushed: boolean
  pushNav: (isPushed: boolean) => void
}

export interface MenuTheme {
  border: string
  topBar: string
  leftBarBody: string
  leftBarFooter: string
}

export interface LinkStatus {
  text: string
  color: keyof Colors
}

export interface MenuSubEntry {
  label: string
  href: string
  icon?: ReactNode
  calloutClass?: string
  status?: LinkStatus
}

export interface MenuEntry {
  label: string
  icon: ReactNode
  items?: MenuSubEntry[]
  href?: string
  calloutClass?: string
  initialOpenState?: boolean
  status?: LinkStatus
}

export interface PanelProps {
  isDark: boolean
  toggleTheme: () => void
  cakePriceUsd?: number
  currentLang: string
  langs: Language[]
  setLang: (lang: Language) => void
  links: Array<MenuEntry>
}

export interface NavProps extends PanelProps {
  logoTitle?: string
  account?: string
  claimable?: boolean
  claim?: () => void
  login?: Login
  profile?: Profile
  logout?: () => void
}
