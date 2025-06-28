import React from 'react';
import { motion } from 'framer-motion';

class BlockErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    console.error('Content Block Error:', {
      blockIndex: this.props.blockIndex,
      blockType: this.props.blockType,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Optional: Send to external error tracking service
    if (window.errorTracking) {
      window.errorTracking.captureException(error, {
        tags: {
          component: 'ContentBlock',
          blockType: this.props.blockType,
          blockIndex: this.props.blockIndex
        },
        extra: errorInfo
      });
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="block-error-boundary p-6 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="text-red-400 text-2xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-red-300 font-semibold mb-2">
                Content Block Error
              </h3>
              <p className="text-red-200 text-sm mb-4">
                This content block encountered an error and couldn't be displayed. 
                {this.props.blockType && ` (${this.props.blockType} block)`}
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4">
                  <summary className="text-red-300 text-xs cursor-pointer hover:text-red-200">
                    Technical Details (Development Mode)
                  </summary>
                  <div className="mt-2 p-3 bg-black/20 rounded text-xs font-mono text-red-200">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && this.state.errorInfo.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default BlockErrorBoundary; 