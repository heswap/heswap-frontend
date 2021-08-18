export interface HistoryRecord {
  bets: Array<number>
  outcome: number
}

export interface HistoryRowProps extends HistoryRecord {
  id: number
}

export interface StatsRowProps {
  color: string;
  label: string;
  scores: Array<number>
}
