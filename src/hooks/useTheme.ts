import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'
import { red, blue, green, yellow, grey } from 'utils/palette'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  theme.colors.primary = green[400]
  theme.colors.secondary = red[400]
  theme.colors.success = yellow[400]
  theme.colors.warning = blue[400]
  theme.colors.background = green[800]
  theme.colors.backgroundDisabled = green[100]
  theme.colors.dropdown = green[900]
  theme.colors.tertiary = green[100]
  theme.colors.inputBorder = green[700]
  theme.colors.inputFocusedBorder = green[600]
  theme.colors.text = grey[500]
  theme.colors.textDisabled = grey[400]
  theme.colors.textSubtle = green[200]
  theme.colors.gradients.pageHeader = `linear-gradient(180deg, ${green[700]}, ${green[400]})`
  theme.colors.gradients.cardHeader = `linear-gradient(180deg, ${green[800]}, ${green[500]})`
  theme.colors.gradients.slickDotLoading = `linear-gradient(270deg, ${blue[400]}, ${blue[600]})`
  theme.colors.gradients.cardDiagonal = `linear-gradient(235deg, ${green[400]} 4.05%, ${green[600]} 103.52%)`
  theme.menu.topBarColor = green[900]
  theme.menu.leftBarColor = green[700]
  theme.radii.card = '16px'
  theme.shadows.inset = 'rgb(74 74 104 / 10%) 0px 2px 2px -1px inset'
  theme.toggle.checkedHandleColor = theme.colors.success
  theme.toggle.uncheckedHandleColor = theme.colors.textSubtle
  return { isDark, toggleTheme, theme }
}

export default useTheme
