import React from 'react'
import styled from 'styled-components'
import { elevations } from 'utils/palette'
import { BankTableProps } from './types'
import BankRow from './BankRow'

const Container = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`

const Table = styled.div`
  background-color: ${elevations.dp06};
  padding: 32px 8px;
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.backgroundDisabled};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 16px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 32px;
  }
`

const BankTable: React.FC<BankTableProps> = ({ records }) => {
  return (
    <Container>
      <Table role="table">
        {records.map((record, index) => (
          <BankRow key={index.toString()} {...record} />
        ))}
      </Table>
    </Container>
  )
}

export default BankTable
