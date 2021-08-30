export interface HistoryRecord {
  betNums: Array<number>
  betAmount: string
  outcome: number
  time: number
  roll: number
  profit: number
}

export interface HistoryRowProps extends HistoryRecord {
  id: number
}

export interface StatsRowProps {
  color: string
  label: string
  scores: Array<number>
}
