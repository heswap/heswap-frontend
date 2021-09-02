/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import { DiceState } from './types'

const initialState: DiceState = {
  attending: false,
  paused: true,
  bankerTimeBlocks: null,
  playerTimeBlocks: null,
  currentGame: null,
  currentEpoch: null,
  claimable: false,
  currentRound: null,
  rounds: [],
  publicHistoryRecords: [],
  privateHistoryRecords: []
}

export const diceSlice = createSlice({
  name: 'Dice',
  initialState,
  reducers: {
    updateState: (state, action: PayloadAction<DiceState>) => {
      assign(state, action.payload)
    }
  }
})

// Actions
export const { updateState } = diceSlice.actions

export default diceSlice.reducer