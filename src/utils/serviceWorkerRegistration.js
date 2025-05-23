// Service Worker Registration for BeginningWithAI PWA
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

const CONFIG = {
  onSuccess: null,
  onUpdate: null,
  onOffline: null,
  onOnline: null
};

export function register(config = {}) {
  Object.assign(CONFIG, config);

  if ('serviceWorker' in navigator) {
    // Check if the app is served from localhost
    if (isLocalhost) {
      checkValidServiceWorker('/sw.js', config);
      
      // Add some helpful logging for localhost
      navigator.serviceWorker.ready.then(() => {
        console.log(
          'This web app is being served cache-first by a service worker. ' +
          'To learn more, visit https://cra.link/PWA'
        );
      });
    } else {
      // Register service worker in production
      registerValidSW('/sw.js', config);
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('SW: Registration successful', registration);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log('SW: New content is available and will be used when all tabs for this page are closed.');
              
              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('SW: Content is cached for offline use.');
              
              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('SW: Registration failed', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('SW: No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Handle online/offline status
function handleOnline() {
  console.log('App: Back online');
  if (CONFIG.onOnline) {
    CONFIG.onOnline();
  }
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('app-online'));
}

function handleOffline() {
  console.log('App: Gone offline');
  if (CONFIG.onOffline) {
    CONFIG.onOffline();
  }
  
  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('app-offline'));
}

// Utility functions for PWA features
export const PWAUtils = {
  // Check if app is installed
  isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  },

  // Check if browser supports PWA features
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  // Get installation prompt
  async getInstallPrompt() {
    return new Promise((resolve) => {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        resolve(e);
      });
    });
  },

  // Show install prompt
  async showInstallPrompt() {
    const prompt = await this.getInstallPrompt();
    if (prompt) {
      const result = await prompt.prompt();
      return result.outcome === 'accepted';
    }
    return false;
  },

  // Check network status
  isOnline() {
    return navigator.onLine;
  },

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
};

export default { register, unregister, PWAUtils }; 