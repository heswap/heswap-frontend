import { DiceHistoryRecord } from 'state/types'

export interface HistoryRowProps extends DiceHistoryRecord {
  mode: 'public' | 'private'
}

export interface StatsRowProps {
  color: string
  label: string
  scores: Array<number>
}
