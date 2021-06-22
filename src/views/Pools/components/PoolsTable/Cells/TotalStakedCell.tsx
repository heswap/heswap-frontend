import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from '@heswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked } = pool

  const isManualCakePool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [totalStaked, stakingToken.decimals])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        {totalStakedBalance ? (
          <Flex height="100%" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
