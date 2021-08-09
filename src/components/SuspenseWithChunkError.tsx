import React, { Suspense, SuspenseProps } from 'react'

interface State {
  hasError: boolean
  animationDone: boolean
}

class SuspenseWithChunkError extends React.Component<SuspenseProps, State> {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      animationDone: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ animationDone: true })
    }, 4000) // animation takes a bit of time
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error) {
    const isJsChunkLoadError = error.name === 'ChunkLoadError'
    const isCssChunkLoadError = error.code === 'CSS_CHUNK_LOAD_FAILED'
    const isChunkLoadError = isJsChunkLoadError || isCssChunkLoadError

    // Save a flag on the window object indicating that we have already had a chunk error.
    // This prevents infinite reloads
    const isRecoveringFromChunkError = !!window.history.state?.isRecoveringFromChunkError

    // If was a chunk load error, refresh the page
    if (isChunkLoadError && !isRecoveringFromChunkError) {
      const nextState = { ...window.history.state, isRecoveringFromChunkError: true }
      window.history.replaceState(nextState, '')
      window.location.reload()
      return
    }

    throw error
  }

  render() {
    const { hasError, animationDone } = this.state
    const { fallback } = this.props

    if (hasError || !animationDone) {
      return fallback
    }

    return <Suspense {...this.props} />
  }
}

export default SuspenseWithChunkError
