import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from 'utils/palette'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  theme.colors.primary = indigo[400]
  theme.colors.secondary = red[400]
  theme.colors.success = cyan[400]
  theme.colors.warning = amber[400]
  theme.colors.background = indigo[900]
  theme.colors.backgroundDisabled = indigo[100]
  theme.colors.dropdown = indigo[900]
  theme.colors.tertiary = indigo[100]
  theme.colors.inputBorder = indigo[700]
  theme.colors.inputFocusedBorder = indigo[600]
  theme.colors.text = grey[500]
  theme.colors.textDisabled = grey[400]
  theme.colors.textSubtle = indigo[200]
  theme.colors.gradients.pageHeader = `linear-gradient(180deg, ${indigo[700]}, ${indigo[400]})`
  theme.colors.gradients.cardHeader = `linear-gradient(180deg, ${indigo[800]}, ${indigo[600]})`
  theme.colors.gradients.slickDotLoading = `linear-gradient(270deg, ${amber[400]}, ${amber[600]})`
  theme.colors.gradients.cardDiagonal = `linear-gradient(235deg, ${indigo[400]} 4.05%, ${indigo[600]} 103.52%)`
  theme.menu.topBarColor = indigo[900]
  theme.menu.leftBarColor = indigo[700]
  theme.radii.card = '16px'
  theme.shadows.inset = 'rgb(74 74 104 / 10%) 0px 2px 2px -1px inset'
  theme.toggle.checkedHandleColor = theme.colors.success
  theme.toggle.uncheckedHandleColor = theme.colors.textSubtle
  return { isDark, toggleTheme, theme }
}

export default useTheme
