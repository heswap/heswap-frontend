import { DiceHistoryRecord } from 'state/dice/types'

export interface HistoryRowProps extends DiceHistoryRecord {
  mode: 'public' | 'private'
}

export interface StatsRowProps {
  color: string
  label: string
  scores: Array<number>
}
