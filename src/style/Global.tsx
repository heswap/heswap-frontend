import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { LuckyChipTheme } from '@heswap/uikit/dist/theme'
import type { MenuTheme } from '../components/AppMenu/types'
import type { PageHeaderTheme } from '../components/PageHeader/types'
import type { SlickTheme } from '../components/Slick/types'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends LuckyChipTheme {
    menu: MenuTheme
    pageHeader: PageHeaderTheme
    slick: SlickTheme
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'CodecPro', sans-serif;
  }
  body {
    background-color: #071d00;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
