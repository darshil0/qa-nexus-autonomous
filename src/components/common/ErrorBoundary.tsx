import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary Component
 * Catches React errors and displays a fallback UI instead of crashing the app
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    logger.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Send to error tracking service in production
    if (!import.meta.env.DEV) {
      // TODO: Send to Sentry, LogRocket, etc.
      this.reportError(error, errorInfo);
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    // Placeholder for error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send this to your error tracking service
    logger.error('Error report:', errorReport);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          className="error-boundary-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--bg-main)',
            padding: '2rem'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '600px',
              padding: '2rem',
              border: '1px solid var(--accent)',
              background: 'rgba(244, 63, 94, 0.05)'
            }}
          >
            <h2 style={{
              color: 'var(--accent)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Something went wrong
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              >
                <summary style={{
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  overflow: 'auto',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  lineHeight: '1.5'
                }}>
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre style={{
                    overflow: 'auto',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    marginTop: '0.5rem',
                    lineHeight: '1.5'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReload}
                className="btn-primary"
                style={{ flex: 1, minWidth: '120px' }}
              >
                Reload Application
              </button>

              <button
                onClick={this.handleReset}
                className="btn-secondary"
                style={{ flex: 1, minWidth: '120px' }}
              >
                Try Again
              </button>
            </div>

            {import.meta.env.DEV && (
              <p style={{
                marginTop: '1.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'center'
              }}>
                💡 Check the browser console for more details
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
