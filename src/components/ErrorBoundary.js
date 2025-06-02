import React from 'react';
import logger from '../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // reportErrorToService(error, errorInfo);
    }
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally reload the page
    if (this.props.reloadOnReset) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-300 mb-6">
                We're sorry for the inconvenience. The error has been logged and we'll look into it.
              </p>
              
              {/* Show error details only in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                    Error details (development only)
                  </summary>
                  <div className="mt-2 p-4 bg-gray-900 rounded-lg overflow-auto">
                    <pre className="text-xs text-gray-400">
                      {this.state.error.toString()}
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 