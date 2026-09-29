import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  // Yahan Error Boundary isliye use ki hai kyunki kisi render-time component crash ko poore task app ko blank karne se rokna hai.
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="crash-screen">
          <AlertTriangle size={30} />
          <p className="eyebrow">Something went sideways</p>
          <h1>This view could not load.</h1>
          <button className="button button-dark" onClick={() => window.location.reload()}>
            <RotateCcw size={16} /> Reload app
          </button>
        </main>
      )
    }
    return this.props.children
  }
}