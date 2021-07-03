import React from 'react'
import styled from 'styled-components'
import { ListViewIcon, CardViewIcon, IconButton } from '@heswap/uikit'
import useTheme from 'hooks/useTheme'
import { ViewMode } from './types'

interface ToggleViewProps {
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const Container = styled.div`
  margin-left: -8px;
  border-radius: 8px;
  background-color: rgb(16, 38, 72);

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`

const CardButton = styled(IconButton)<{ toggled: boolean }>`
  border-radius: 8px;
  background-color: ${({ theme, toggled }) => toggled ? theme.colors.primary : 'transparent'};
`;

const TableButton = styled(IconButton)<{ toggled: boolean }>`
  border-radius: 8px;
  background-color: ${({ theme, toggled }) => toggled ? theme.colors.primary : 'transparent'};
`;

const ToggleView: React.FunctionComponent<ToggleViewProps> = ({ viewMode, onToggle }) => {
  const handleToggle = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onToggle(mode)
    }
  }
  const { theme } = useTheme()

  return (
    <Container>
      <CardButton
        toggled={viewMode === ViewMode.CARD}
        id="clickFarmCardView"
        onClick={() => handleToggle(ViewMode.CARD)}
      >
        <CardViewIcon color={viewMode === ViewMode.CARD ? '#fff' : theme.colors.text} />
      </CardButton>
      <TableButton
        toggled={viewMode === ViewMode.TABLE}
        id="clickFarmTableView"
        onClick={() => handleToggle(ViewMode.TABLE)}
      >
        <ListViewIcon color={viewMode === ViewMode.TABLE ? '#fff' : theme.colors.text} />
      </TableButton>
    </Container>
  )
}

export default ToggleView
