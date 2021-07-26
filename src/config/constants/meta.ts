import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'LuckyChip',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by LuckyChip), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('LuckyChip')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('LuckyChip')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('LuckyChip')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('LuckyChip')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('LuckyChip')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('LuckyChip')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('LuckyChip')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('LuckyChip')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('LuckyChip')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('LuckyChip')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('LuckyChip')}`,
      }
    default:
      return null
  }
}
