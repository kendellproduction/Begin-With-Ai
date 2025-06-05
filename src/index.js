import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { unregister as unregisterSW } from './utils/serviceWorkerRegistration'; // REMOVED
import './firebase'; // Simply import to run initialization code within firebase.js

// Initialize monitoring and analytics
import { initSentry, initGoogleAnalytics } from './utils/monitoring';

// Initialize error tracking and analytics
initSentry();
initGoogleAnalytics();

// Error boundary component with Sentry integration
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send error to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      const Sentry = require('@sentry/react');
      Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize Firebase - THIS IS NO LONGER NEEDED HERE, as firebase.js does it on import
// initializeFirebase(); 

// FORCE UNREGISTER ALL SERVICE WORKERS AND CLEAR CACHES
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister().then(() => {
        console.log('Force unregistered service worker');
      });
    }
  });
}

// Clear all caches
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name).then(() => {
        console.log('Cleared cache:', name);
      });
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// SERVICE WORKER COMPLETELY DISABLED
// If you want your app to work offline and load faster, you can change
// unregisterSW() to registerSW() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// registerSW(); // Comment out original call
// unregisterSW(); // REMOVED - No service worker at all

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
