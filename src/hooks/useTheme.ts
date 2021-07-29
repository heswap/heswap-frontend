import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from 'utils/palette'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  theme.colors.primary = deepPurple[400]
  theme.colors.secondary = red[400]
  theme.colors.success = cyan[400]
  theme.colors.warning = amber[400]
  theme.colors.background = deepPurple[800]
  theme.colors.backgroundDisabled = deepPurple[100]
  theme.colors.dropdown = deepPurple[900]
  theme.colors.tertiary = deepPurple[100]
  theme.colors.inputBorder = deepPurple[700]
  theme.colors.inputFocusedBorder = deepPurple[600]
  theme.colors.text = grey[500]
  theme.colors.textDisabled = grey[400]
  theme.colors.textSubtle = deepPurple[200]
  theme.colors.gradients.pageHeader = `linear-gradient(180deg, ${deepPurple[700]}, ${deepPurple[400]})`
  theme.colors.gradients.cardHeader = `linear-gradient(180deg, ${deepPurple[800]}, ${deepPurple[500]})`
  theme.colors.gradients.slickDotLoading = `linear-gradient(270deg, ${amber[400]}, ${amber[600]})`
  theme.colors.gradients.cardDiagonal = `linear-gradient(235deg, ${deepPurple[400]} 4.05%, ${deepPurple[600]} 103.52%)`
  theme.menu.topBarColor = deepPurple[900]
  theme.menu.leftBarColor = deepPurple[700]
  theme.radii.card = '16px'
  theme.shadows.inset = 'rgb(74 74 104 / 10%) 0px 2px 2px -1px inset'
  theme.toggle.checkedHandleColor = theme.colors.success
  theme.toggle.uncheckedHandleColor = theme.colors.textSubtle
  return { isDark, toggleTheme, theme }
}

export default useTheme
