import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo)
  }

  private handleTryAgain = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary" role="alert">
          <h1>Something went wrong</h1>
          <p>
            An unexpected error occurred while loading this section. You can try
            again to recover.
          </p>

          {this.state.error && (
            <details className="error-details">
              <summary>Error details</summary>
              <pre>{this.state.error.message}</pre>
            </details>
          )}

          <button type="button" onClick={this.handleTryAgain}>
            Try Again
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary