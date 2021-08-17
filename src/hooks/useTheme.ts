import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from 'utils/palette'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  theme.colors.primary = teal[400]
  theme.colors.secondary = red[400]
  theme.colors.success = orange[400]
  theme.colors.warning = deepPurple[400]
  theme.colors.background = teal[800]
  theme.colors.backgroundDisabled = teal[100]
  theme.colors.dropdown = teal[900]
  theme.colors.tertiary = teal[100]
  theme.colors.inputBorder = teal[700]
  theme.colors.inputFocusedBorder = teal[600]
  theme.colors.text = grey[500]
  theme.colors.textDisabled = grey[400]
  theme.colors.textSubtle = teal[200]
  theme.colors.gradients.pageHeader = `linear-gradient(180deg, ${teal[700]}, ${teal[400]})`
  theme.colors.gradients.cardHeader = `linear-gradient(180deg, ${teal[800]}, ${teal[500]})`
  theme.colors.gradients.slickDotLoading = `linear-gradient(270deg, ${deepPurple[400]}, ${deepPurple[600]})`
  theme.colors.gradients.cardDiagonal = `linear-gradient(235deg, ${teal[400]} 4.05%, ${teal[600]} 103.52%)`
  theme.menu.topBarColor = teal[900]
  theme.menu.leftBarColor = teal[700]
  theme.radii.card = '16px'
  theme.shadows.inset = 'rgb(74 74 104 / 10%) 0px 2px 2px -1px inset'
  theme.toggle.checkedHandleColor = theme.colors.success
  theme.toggle.uncheckedHandleColor = theme.colors.textSubtle
  return { isDark, toggleTheme, theme }
}

export default useTheme
