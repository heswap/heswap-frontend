import { createBrowserHistory } from 'history'

// Manually create the history object so we can access outside the Router e.g. in modals
const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
})

export default history
