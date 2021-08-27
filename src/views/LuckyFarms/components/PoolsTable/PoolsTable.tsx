import React, { useRef } from 'react'
import styled from 'styled-components'
import { Box, Button, ChevronUpIcon } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import { elevations } from 'utils/palette'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: Pool[]
  userDataLoaded: boolean
  account: string
  referrer: string
}

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;

  background-color: ${({ theme }) => theme.colors.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const TableWrapper = styled.div`
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataLoaded, account, referrer }) => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  return (
    <TableWrapper>
      <StyledTable role="table" ref={tableWrapperEl}>
        <Box background={elevations.dp06}>
          {pools.map((pool) => (
            <PoolRow
              key={pool.sousId}
              pool={pool}
              account={account}
              userDataLoaded={userDataLoaded}
              referrer={referrer}
            />
          ))}
          <ScrollButtonContainer>
            <Button variant="text" onClick={scrollToTop}>
              {t('To Top')}
              <ChevronUpIcon color="primary" />
            </Button>
          </ScrollButtonContainer>
        </Box>
      </StyledTable>
    </TableWrapper>
  )
}

export default PoolsTable
