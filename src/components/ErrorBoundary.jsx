import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: '#fff', background: '#1a0c0c', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#ff7676' }}>Something broke on this page</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{String(this.state.error && this.state.error.stack || this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
