import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'
import { common, red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from 'utils/palette'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  theme.colors.background = '#121212'
  // theme.colors.backgroundAlt = ''
  theme.colors.backgroundDisabled = 'rgba(255, 255, 255, 0.12)'
  // theme.colors.binance = ''
  // theme.colors.cardBorder = ''
  // theme.colors.contrast = ''
  theme.colors.disabled = 'rgba(255, 255, 255, 0.38)'
  theme.colors.dropdown = grey[500]
  theme.colors.dropdownDeep = grey[200]
  // theme.colors.failure = ''
  // theme.colors.gradients.blue = ''
  // theme.colors.gradients.bubblegum = ''
  theme.colors.gradients.cardDiagonal = `linear-gradient(235deg, ${grey[600]} 4.05%, ${grey[800]} 103.52%)`
  theme.colors.gradients.cardHeader = `linear-gradient(180deg, ${grey[700]}, ${grey[400]})`
  // theme.colors.gradients.gold = ''
  // theme.colors.gradients.inverseBubblegum = ''
  theme.colors.gradients.pageHeader = `linear-gradient(180deg, ${grey[900]}, ${grey[600]})`
  theme.colors.gradients.slickDotLoading = `linear-gradient(180deg, ${green[400]}, ${green[600]})`
  // theme.colors.gradients.violet = ''
  // theme.colors.gradients.violetAlt = ''
  theme.colors.input = grey[400]
  theme.colors.inputBorder = grey[700]
  theme.colors.inputFocusedBorder = grey[600]
  theme.colors.inputSecondary = grey[500]
  theme.colors.invertedContrast = grey[50]
  // theme.colors.overlay = ''
  theme.colors.primary = blue[400]
  theme.colors.primaryBright = blue[200]
  theme.colors.primaryDark = blue[600]
  theme.colors.secondary = purple[400]
  theme.colors.success = green[400]
  theme.colors.tertiary = grey[100]
  theme.colors.text = common.white
  theme.colors.textDisabled = 'rgba(255, 255, 255, 0.5)'
  theme.colors.textSubtle = 'rgba(255, 255, 255, 0.7)'
  theme.colors.warning = orange[400]
  theme.menu.topBarColor = grey[900]
  theme.menu.leftBarColor = grey[800]

  // theme.colors.primary = green[400]
  // theme.colors.secondary = red[400]
  // theme.colors.success = yellow[400]
  // theme.colors.warning = blue[400]
  // theme.colors.background = green[800]
  // theme.colors.backgroundDisabled = green[100]
  // theme.colors.dropdown = green[900]
  // theme.colors.tertiary = green[100]
  // theme.colors.inputBorder = green[700]
  // theme.colors.inputFocusedBorder = green[600]
  // theme.colors.text = grey[500]
  // theme.colors.textDisabled = grey[400]
  // theme.colors.textSubtle = green[200]
  // theme.colors.gradients.pageHeader = `linear-gradient(180deg, ${green[700]}, ${green[400]})`
  // theme.colors.gradients.cardHeader = `linear-gradient(180deg, ${green[800]}, ${green[500]})`
  // theme.colors.gradients.slickDotLoading = `linear-gradient(270deg, ${blue[400]}, ${blue[600]})`
  // theme.colors.gradients.cardDiagonal = `linear-gradient(235deg, ${green[400]} 4.05%, ${green[600]} 103.52%)`
  // theme.menu.topBarColor = green[900]
  // theme.menu.leftBarColor = green[700]

  theme.radii.card = '16px'
  theme.shadows.inset = 'rgb(74 74 104 / 10%) 0px 2px 2px -1px inset'
  theme.toggle.checkedHandleColor = theme.colors.success
  theme.toggle.uncheckedHandleColor = theme.colors.textSubtle

  return { isDark, toggleTheme, theme }
}

export default useTheme
