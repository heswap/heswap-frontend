import React from 'react'
import styled from 'styled-components'
import { ListViewIcon, CardViewIcon, IconButton } from '@heswap/uikit'
import useTheme from 'hooks/useTheme'

export enum ViewMode {
  TABLE = 'TABLE',
  CARD = 'CARD',
}

interface ToggleViewProps {
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const Container = styled.div`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.dropdown};
`

const CardButton = styled(IconButton)<{ toggled: boolean }>`
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme, toggled }) => (toggled ? theme.colors.primary : 'transparent')};
`

const TableButton = styled(IconButton)<{ toggled: boolean }>`
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme, toggled }) => (toggled ? theme.colors.primary : 'transparent')};
`

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
        width="40px"
        toggled={viewMode === ViewMode.CARD}
        id="clickFarmCardView"
        onClick={() => handleToggle(ViewMode.CARD)}
      >
        <CardViewIcon color={theme.colors[viewMode === ViewMode.CARD ? 'backgroundAlt' : 'text']} />
      </CardButton>
      <TableButton
        width="40px"
        toggled={viewMode === ViewMode.TABLE}
        id="clickFarmTableView"
        onClick={() => handleToggle(ViewMode.TABLE)}
      >
        <ListViewIcon color={theme.colors[viewMode === ViewMode.TABLE ? 'backgroundAlt' : 'text']} />
      </TableButton>
    </Container>
  )
}

export default ToggleView
