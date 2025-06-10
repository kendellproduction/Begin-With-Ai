import React, { useState, useEffect } from 'react';

const APIStatusIndicator = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  const checkAPIStatus = async () => {
    setApiStatus('checking');
    try {
      // Simple test to see if API key is available
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        setApiStatus('no-key');
        return;
      }

      // You could add a simple API call here to test, but for now just check if key exists
      setApiStatus('available');
      setLastChecked(new Date());
    } catch (error) {
      console.error('API status check failed:', error);
      setApiStatus('error');
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
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'available': return '✅';
      case 'checking': return '🔄';
      case 'no-key': return '❌';
      case 'error': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'available': return 'AI Ready';
      case 'checking': return 'Checking...';
      case 'no-key': return 'No API Key';
      case 'error': return 'API Error';
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
    </div>
  );
};

export default APIStatusIndicator; 