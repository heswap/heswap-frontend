import { MenuEntry } from '@heswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Lucky Swap'),
    icon: 'TradeIcon',
    items: [
      {
        label: t('Exchange'),
        href: 'http://101.36.111.81:3002/#/swap',
      },
      {
        label: t('Liquidity'),
        href: 'http://101.36.111.81:3002/#/pool',
      },
      {
        label: t('Farms'),
        href: '/farms',
      },
    ],
  },
  {
    label: t('Lucky Dice'),
    icon: 'DiceIcon',
    items: [
      {
        label: t('Play'),
        href: '/lucky_dice',
      },
      {
        label: t('Bank'),
        href: '/lucky_bank',
      },
      {
        label: t('Farms'),
        href: '/lucky_farms',
      },
    ],
  },
  {
    label: t('Referrals'),
    icon: 'GroupsIcon',
    href: '/referrals',
  },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Docs'),
        href: 'https://heswap.finance/docs',
      },
      {
        label: t('Github'),
        href: 'https://github.com/heswap',
      },
      {
        label: t('Audits'),
        href: 'https://heswap.finance/audit',
      },
    ],
  },
]

export default config
