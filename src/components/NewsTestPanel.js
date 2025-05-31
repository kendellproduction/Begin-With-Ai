import React, { useState } from 'react';
import { updateAINews } from '../services/newsService';

const NewsTestPanel = ({ onNewsUpdated }) => {
  const [updating, setUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [status, setStatus] = useState('');

  const handleManualUpdate = async () => {
    try {
      setUpdating(true);
      setStatus('Fetching latest AI news...');
      
      console.log('🔄 Starting manual news update...');
      const results = await updateAINews();
      
      setStatus(`✅ Updated! Found ${results.length} articles`);
      setLastUpdate(new Date());
      
      // Notify parent component to refresh
      if (onNewsUpdated) {
        onNewsUpdated();
      }
      
      setTimeout(() => setStatus(''), 5000);
      
    } catch (error) {
      console.error('❌ News update failed:', error);
      setStatus('❌ Update failed. Check console for details.');
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setUpdating(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-600 max-w-sm">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <span className="text-2xl mr-2">🧪</span>
        News Testing Panel
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={handleManualUpdate}
          disabled={updating}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            updating 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 hover:scale-105'
          } text-white font-medium`}
        >
          {updating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Updating...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Fetch News Now</span>
            </>
          )}
        </button>

        {status && (
          <div className={`text-sm p-2 rounded-lg ${
            status.startsWith('✅') 
              ? 'bg-green-900/50 text-green-200' 
              : status.startsWith('❌')
              ? 'bg-red-900/50 text-red-200'
              : 'bg-blue-900/50 text-blue-200'
          }`}>
            {status}
          </div>
        )}

        {lastUpdate && (
          <div className="text-xs text-gray-400">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-600">
        <div className="text-xs text-gray-400 space-y-1">
          <div>📊 Client-Side News Sources:</div>
          <div className="text-xs">• OpenAI Blog (RSS)</div>
          <div className="text-xs">• NVIDIA AI Blog (RSS)</div>
          <div className="text-xs">• AI News (RSS)</div>
          <div className="text-xs">• VentureBeat AI (RSS)</div>
          <div className="text-xs">• The Verge AI (RSS)</div>
          <div className="text-xs">• MIT Technology Review (RSS)</div>
          <div className="text-xs text-green-400 mt-2">✅ No Cloud Functions needed!</div>
        </div>
      </div>
    </div>
  );
};

export default NewsTestPanel; 