import React, { useRef } from 'react'
import styled from 'styled-components'
import { Box, Button, ChevronUpIcon, Grid, Text } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DiceHistoryRecord } from 'state/dice/types'
import HistoryRow from './HistoryRow'

interface HistoryTableProps {
  records: Array<DiceHistoryRecord>
  mode: 'public' | 'private'
}

const Table = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const GridLayout = styled(Grid)`
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 16px;
`

const HistoryHeader = ({ mode }) => (
  <Box p="8px 0">
    <GridLayout>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Bet Hash</Text>
      </div>
      {mode === 'public' && (
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle" bold>User</Text>
        </div>
      )}
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle" bold>Bet Amount</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Time</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Chance</Text>
      </div>
      {mode === 'private' && (
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">Roll</Text>
        </div>
      )}
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Profit</Text>
      </div>
    </GridLayout>
  </Box>
)

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const HistoryTable: React.FC<HistoryTableProps> = ({ records, mode }) => {
  const { t } = useTranslation()
  const tableRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    tableRef.current.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <>
      <Table ref={tableRef}>
        <HistoryHeader mode={mode} />
        {records.map((round, index) => (
          <HistoryRow key={index.toString()} {...round} mode={mode} />
        ))}
      </Table>
      <ScrollButtonContainer>
        <Button variant="text" onClick={scrollToTop}>
          {t('To Top')}
          <ChevronUpIcon color="primary" />
        </Button>
      </ScrollButtonContainer>
    </>
  )
}

export default HistoryTable
