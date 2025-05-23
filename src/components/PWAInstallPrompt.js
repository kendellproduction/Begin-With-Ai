import React, { useState, useEffect } from 'react';
import { PWAUtils } from '../utils/serviceWorkerRegistration';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    setIsInstalled(PWAUtils.isInstalled());
    
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual install instructions
    if (iOS && !PWAUtils.isInstalled()) {
      setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      console.log('Install prompt result:', result);
      setShowPrompt(false);
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Hide for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showPrompt || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-indigo-600 text-white rounded-lg shadow-lg p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white hover:text-gray-200 text-xl leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
        
        <div className="pr-6">
          <div className="flex items-center mb-2">
            <img src="/logo192.png" alt="BeginningWithAI" className="w-8 h-8 mr-2 rounded" />
            <h3 className="font-semibold text-sm">Install BeginningWithAI</h3>
          </div>
          
          {isIOS ? (
            <div className="text-sm">
              <p className="mb-2">Install this app on your device:</p>
              <ol className="text-xs space-y-1 pl-4">
                <li>1. Tap the Share button</li>
                <li>2. Scroll down and tap "Add to Home Screen"</li>
                <li>3. Tap "Add" to install</li>
              </ol>
            </div>
          ) : (
            <div>
              <p className="text-sm mb-3">
                Get the full experience! Install our app for faster access and offline support.
              </p>
              <button
                onClick={handleInstallClick}
                className="bg-white text-indigo-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Install App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt; 