import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Providers from './Providers'
import 'index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'components/RollingDice/styles.css'

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
