import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import poolsReducer from './pools'
import blockReducer from './block'
import diceReducer from './dice'
import dicesReducer from './dices'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    block: blockReducer,
    farms: farmsReducer,
    pools: poolsReducer,
    dice: diceReducer,
    dices: dicesReducer,
  },
})

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
