import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';

const APIStatusIndicator = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [message, setMessage] = useState('');

  const checkAPIStatus = async () => {
    setApiStatus('checking');
    try {
      // Since Firebase config is working (evidenced by successful Firebase loading),
      // we know environment variables are accessible. Let's check them directly.
      
      // Check for OpenAI API key (multiple possible env var names)
      const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const xaiKey = process.env.REACT_APP_XAI_API_KEY;
      const anthropicKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
      
      // Debug logging for development
          // API status check
      
      const hasAPIKey = !!(openaiKey || xaiKey || anthropicKey);
      const hasFirebaseAuth = !!auth;
      
              if (!hasAPIKey) {
          setApiStatus('no-key');
          setMessage('No AI API key configured');
          return;
        }

        if (!hasFirebaseAuth) {
          setApiStatus('warning');
          setMessage('Firebase authentication required');
          return;
        }
      setApiStatus('available');
      setLastChecked(new Date());
      setMessage('AI features ready');
    } catch (error) {
      console.error('❌ API status check failed:', error);
      setApiStatus('error');
      setMessage('API Error');
    }
  };

  useEffect(() => {
    checkAPIStatus();
    // Check every 5 minutes
    const interval = setInterval(checkAPIStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'available': return 'text-green-400';
      case 'checking': return 'text-yellow-400';
      case 'no-key': return 'text-red-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'available': return '✅';
      case 'checking': return '🔄';
      case 'no-key': return '❌';
      case 'error': return '⚠️';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'available': {
        // Show which API provider is configured
        if (process.env.REACT_APP_OPENAI_API_KEY) return 'OpenAI Ready';
        if (process.env.REACT_APP_XAI_API_KEY) return 'xAI Ready';
        if (process.env.REACT_APP_ANTHROPIC_API_KEY) return 'Anthropic Ready';
        return 'AI Ready';
      }
      case 'checking': return 'Checking...';
      case 'no-key': return 'No API Key';
      case 'error': return 'API Error';
      case 'warning': return 'Firebase Authentication Required';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <span className={getStatusColor()}>
        {getStatusIcon()} {getStatusText()}
      </span>
      {lastChecked && (
        <span className="text-gray-500">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
      {message && (
        <span className="text-gray-500">
          ({message})
        </span>
      )}
    </div>
  );
};

export default APIStatusIndicator; 