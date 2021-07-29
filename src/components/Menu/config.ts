import { MenuEntry } from '@heswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Swap'),
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
    ],
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Lucky Dice'),
    icon: 'DiceIcon',
    items: [
      {
        label: 'LKCP',
        href: '/lucky_dice?coin=LKCP',
      },
      {
        label: 'BNB',
        href: '/lucky_dice?coin=BNB',
      },
      {
        label: 'BUSD',
        href: '/lucky_dice?coin=BUSD',
      },
      {
        label: 'BTCB',
        href: '/lucky_dice?coin=BTCB',
      },
      {
        label: 'ETH',
        href: '/lucky_dice?coin=ETH',
      },
    ],
  },
  {
    label: t('Lucky Bank'),
    icon: 'BankIcon',
    href: '/lucky_bank',
  },
  {
    label: t('Lucky Farms'),
    icon: 'PoolIcon',
    href: '/lucky_farms',
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
        href: 'https://github.com/heswap',
      },
      {
        label: t('Github'),
        href: 'https://github.com/heswap',
      },
      {
        label: t('Audits'),
        href: 'https://github.com/heswap',
      },
    ],
  },
]

export default config
