import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@heswap/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollCoreFarmData, usePollBlockNumber, usePollDiceData } from 'state/hooks'
import GlobalStyle from './style/Global'
import AppMenu from './components/AppMenu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import EasterEgg from './components/EasterEgg'
import LuckyFarms from './views/LuckyFarms'
import LuckyBank from './views/LuckyBank'
import LuckyDice from './views/LuckyDice'
import history from './routerHistory'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const NotFound = lazy(() => import('./views/NotFound'))
const Referrals = lazy(() => import('./views/Referrals'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  usePollCoreFarmData()
  usePollDiceData()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <AppMenu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/farms/:referrer">
              <Farms />
            </Route>
            <Route path="/lucky_farms">
              <LuckyFarms />
            </Route>
            <Route path="/lucky_bank">
              <LuckyBank />
            </Route>
            <Route path="/pools/:referrer">
              <LuckyFarms />
            </Route>
            {/* Redirect */}
            <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/referrals">
              <Referrals />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>
            <Route path="/lucky_dice">
              <LuckyDice />
            </Route>
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </AppMenu>
      <EasterEgg iterations={2} />
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
