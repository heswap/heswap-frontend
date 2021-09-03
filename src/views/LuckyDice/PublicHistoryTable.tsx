import React, { useRef } from 'react'
import styled from 'styled-components'
import { BigNumber, ethers } from 'ethers'
import { Box, Button, ChevronUpIcon, Grid, Text } from '@heswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DiceRound, DiceStatus } from 'state/dice/types'

interface TableProps {
  records: Array<DiceRound>
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

const TableHeader = () => (
  <Box p="8px 0">
    <GridLayout>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Bank Hash</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Total Amount</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Bonus Amount</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Swap LC Amount</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Bet Users</Text>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Drawn Number</Text>
      </div>
      {/* <div style={{ textAlign: 'center' }}>
        <Text color="textSubtle">Status</Text>
      </div> */}
    </GridLayout>
  </Box>
)

function getStatusText(status: DiceStatus) {
  switch (status) {
    case DiceStatus.Pending:
      return 'Pending'
    case DiceStatus.Open:
      return 'Open'
    case DiceStatus.Claimable:
      return 'Claimable'
    case DiceStatus.Expired:
      return 'Expired'
    default:
      return ''
  }
}

const TableRow: React.FC<DiceRound> = ({ startBlock, lockBlock, secretSentBlock, bankHash, bankSecret, totalAmount, maxBetAmount, betAmounts, lcBackAmount, bonusAmount, swapLcAmount, betUsers, finalNumber, status }) => {
  return (
    <Box p="16px 0">
      <GridLayout>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{`${bankHash.substr(0, 4)}...${bankHash.substr(bankHash.length - 4)}`}</Text>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
          <Box width="16px" mr="8px">
            <img alt="" src={`${process.env.PUBLIC_URL}/images/tokens/bnb.png`} />
          </Box>
          <Text color="textSubtle">{ethers.utils.formatEther(BigNumber.from(totalAmount))}</Text>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
          <Box width="16px" mr="8px">
            <img alt="" src={`${process.env.PUBLIC_URL}/images/tokens/bnb.png`} />
          </Box>
          <Text color="text" bold>{ethers.utils.formatEther(BigNumber.from(bonusAmount))}</Text>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
          <Box width="16px" mr="8px">
            <img alt="" src={`${process.env.PUBLIC_URL}/images/tokens/bnb.png`} />
          </Box>
          <Text color="text" bold>{ethers.utils.formatEther(BigNumber.from(swapLcAmount))}</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{betUsers}</Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{finalNumber + 1}</Text>
        </div>
        {/* <div style={{ textAlign: 'center' }}>
          <Text color="textSubtle">{getStatusText(status)}</Text>
        </div> */}
      </GridLayout>
    </Box>
  )
}

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const PublicHistoryTable: React.FC<TableProps> = ({ records }) => {
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
        <TableHeader />
        {records.map((round, index) => (
          <TableRow key={index.toString()} {...round} />
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

export default PublicHistoryTable
