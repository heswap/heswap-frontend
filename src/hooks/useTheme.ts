import { useContext } from 'react'
import { ThemeContext as StyledThemeContext } from 'styled-components'
import { ThemeContext } from 'contexts/ThemeContext'

const useTheme = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const theme = useContext(StyledThemeContext)
  theme.colors.primary = 'rgb(18, 99, 241)'
  theme.colors.secondary = 'rgb(249, 59, 93)'
  theme.colors.success = 'rgb(29, 200, 114)'
  theme.colors.background = 'rgb(7, 22, 45)'
  theme.colors.backgroundDisabled = 'rgb(200, 212, 230)'
  theme.colors.text = 'rgb(112, 141, 183)'
  theme.colors.textDisabled = 'rgb(112, 141, 183)'
  theme.colors.textSubtle = 'rgb(116, 155, 216)'
  theme.colors.inputSecondary = 'rgb(28, 50, 84)'
  theme.colors.gradients.bubblegum = 'linear-gradient(180deg, #071c3c, #002b6f)'
  theme.leftBar.background = 'rgb(16, 38, 72)'
  theme.leftBar.footerBackground = 'rgb(28, 50, 84)'
  theme.shadows.inset = 'rgb(74 74 104 / 10%) 0px 2px 2px -1px inset'
  theme.toggle.checkedHandleColor = theme.colors.success
  theme.toggle.uncheckedHandleColor = theme.colors.textSubtle
  console.warn('theme', theme)
  return { isDark, toggleTheme, theme }
}

export default useTheme
