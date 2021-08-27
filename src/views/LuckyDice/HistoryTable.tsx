import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import HistoryRow from './HistoryRow'
import { HistoryRowProps } from './types'

interface HistoryTableProps {
  records: Array<HistoryRowProps>
}

const Table = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
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
        {records.map((record, index) => (
          <HistoryRow key={index.toString()} {...record} />
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
