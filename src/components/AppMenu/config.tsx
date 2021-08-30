import React from 'react'
import { IoIosCash, IoIosPeople, IoIosSwap } from 'react-icons/io'
import { IoBicycle, IoColorWand, IoDice, IoEllipsisHorizontal, IoHome } from 'react-icons/io5'
import { ContextApi } from 'contexts/Localization/types'
import { MenuEntry } from './types'

export const links: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: <IoHome fontSize="24px" />,
    href: '/',
  },
  {
    label: t('Swap'),
    icon: <IoIosSwap fontSize="24px" />,
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
    icon: <IoBicycle fontSize="24px" />,
    href: '/farms',
  },
  {
    label: t('Lucky Dice'),
    icon: <IoDice fontSize="24px" />,
    items: [
      {
        label: 'LC',
        href: '/lucky_dice?coin=LC',
      },
      {
        label: 'WBNB',
        href: '/lucky_dice?coin=WBNB',
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
    icon: <IoIosCash fontSize="24px" />,
    href: '/lucky_bank',
  },
  {
    label: t('Lucky Farms'),
    icon: <IoColorWand fontSize="24px" />,
    href: '/lucky_farms',
  },
  {
    label: t('Referrals'),
    icon: <IoIosPeople fontSize="24px" />,
    href: '/referrals',
  },
  {
    label: t('More'),
    icon: <IoEllipsisHorizontal fontSize="24px" />,
    items: [
      {
        label: t('Docs'),
        href: 'https://luckychip-finance/docs',
      },
      {
        label: t('Github'),
        href: 'https://github.com/luckychip',
      },
      {
        label: t('Audits'),
        href: 'https://luckychip-finance/audit',
      },
    ],
  },
]

export const MENU_HEIGHT = 64;
export const MENU_ENTRY_HEIGHT = 48;
export const SIDEBAR_WIDTH_FULL = 240;
export const SIDEBAR_WIDTH_REDUCED = 56;
