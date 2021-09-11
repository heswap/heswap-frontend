/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import dicesConfig from 'config/constants/dices'
import { DicesState, Dice, AppThunk } from 'state/types'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { ethers } from 'ethers'
import {
  fetchProfitRate,
  fetchWithdrawableAmounts,
  fetchWithdrawableAmount,
  fetchDicesAllowance,
  fetchUserBalances,
  fetchDicesTokenAllowance,
} from './fetchDicesUser'

const initialState: DicesState = {
  data: [...dicesConfig],
  userDataLoaded: false,
}

export const fetchDicesUserDataAsync =
  (account: string): AppThunk =>
  async (dispatch) => {
    const withdrawableAmounts = await fetchWithdrawableAmounts(account)
    const allowances = await fetchDicesAllowance(account)
    const diceAllowances = await fetchDicesTokenAllowance(account)
    const depositTokenBalances = await fetchUserBalances(account)

    const userData = await Promise.all(
      dicesConfig.map(async (dice) => {
        let profitRate = ethers.BigNumber.from(0)
        if (withdrawableAmounts[dice.diceId] > 0) {
          profitRate = ethers.BigNumber.from(await fetchProfitRate(account, dice.diceId))
        }
        return {
          diceId: dice.diceId,
          allowance: allowances[dice.diceId],
          diceAllowance: diceAllowances[dice.diceId],
          depositTokenBalance: depositTokenBalances[dice.diceId],
          withdrawableAmount: withdrawableAmounts[dice.diceId],
          profitRate: profitRate.toNumber(),
        }
      }),
    )

    dispatch(setDicesUserData(userData))
  }

export const updateUserDiceData =
  (diceId: number, account: string): AppThunk =>
  async (dispatch) => {
    const withdrawableAmounts = await fetchWithdrawableAmounts(account)
    dispatch(updateDicesUserData({ diceId, field: 'withdrawableAmount', value: withdrawableAmounts[diceId] }))
    if (withdrawableAmounts[diceId] > 0) {
      const profitRate = ethers.BigNumber.from(await fetchProfitRate(account, diceId))
      dispatch(updateDicesUserData({ diceId, field: 'profitRate', value: profitRate.toNumber() }))
    }
  }

export const updateDiceAllowance =
  (diceId: number, account: string): AppThunk =>
  async (dispatch) => {
    const allowances = await fetchDicesAllowance(account)
    dispatch(updateDicesUserData({ diceId, field: 'allowance', value: allowances[diceId] }))
  }

export const updateDiceTokenAllowance =
  (diceId: number, account: string): AppThunk =>
  async (dispatch) => {
    const diceAllowances = await fetchDicesTokenAllowance(account)
    dispatch(updateDicesUserData({ diceId, field: 'diceAllowance', value: diceAllowances[diceId] }))
  }

export const updateDiceBalance =
  (diceId: number, account: string): AppThunk =>
  async (dispatch) => {
    const balances = await fetchUserBalances(account)
    dispatch(updateDicesUserData({ diceId, field: 'depositTokenBalance', value: balances[diceId] }))
  }

export const DicesSlice = createSlice({
  name: 'Dices',
  initialState,
  reducers: {
    setDicesPublicData: (state, action) => {
      const liveDicesData: Dice[] = action.payload
      state.data = state.data.map((dice) => {
        const liveDiceData = liveDicesData.find((entry) => entry.diceId === dice.diceId)
        return { ...dice, ...liveDiceData }
      })
    },
    setDicesUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((dice) => {
        const userDiceData = userData.find((entry) => entry.diceId === dice.diceId)
        return { ...dice, userData: userDiceData }
      })
      state.userDataLoaded = true
    },
    updateDicesUserData: (state, action) => {
      const { field, value, diceId } = action.payload
      const index = state.data.findIndex((p) => p.diceId === diceId)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
  },
})

// Actions
export const { setDicesPublicData, setDicesUserData, updateDicesUserData } = DicesSlice.actions

export default DicesSlice.reducer
