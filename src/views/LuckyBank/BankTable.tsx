import React from 'react'
import styled from 'styled-components'
import { Box } from '@heswap/uikit'
import { elevations } from 'utils/palette'
import { BankTableProps } from './types'
import BankRow from './BankRow'

const TableWrapper = styled.div`
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const Container = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.background};
`

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
  background-color: ${elevations.dp06};

  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.backgroundDisabled};
  }
`

const BankTable: React.FC<BankTableProps> = ({ records }) => {
  return (
    <TableWrapper>
      <Container>
        <StyledTable role="table">
          {records.map((record, index) => (
            <BankRow key={index.toString()} {...record} />
          ))}
        </StyledTable>
      </Container>
    </TableWrapper>
  )
}

export default BankTable
