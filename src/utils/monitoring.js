import * as Sentry from "@sentry/react";

// Initialize Sentry Error Tracking
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN, // Add this to your .env.local
      environment: process.env.NODE_ENV,
      beforeSend(event, hint) {
        // Filter out development-related errors
        if (event.exception) {
          const error = hint.originalException;
          if (error && error.message && error.message.includes('Non-Error promise rejection')) {
            return null; // Don't send this common React error
          }
        }
        return event;
      },
    });
  }
};

// Initialize Google Analytics
export const initGoogleAnalytics = () => {
  if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtagFunc() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtagFunc;

    window.gtag('js', new Date());
    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll manually track page views
    });
  }
};

// Custom Analytics Events
export const trackEvent = (eventName, parameters = {}) => {
  if (process.env.NODE_ENV === 'production' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Track specific BeginningWithAi events
export const analytics = {
  // User engagement events
  userSignUp: (method) => trackEvent('sign_up', { method }),
  userLogin: (method) => trackEvent('login', { method }),
  emailVerified: () => trackEvent('email_verified'),
  
  // Learning events
  assessmentStarted: () => trackEvent('assessment_started'),
  assessmentCompleted: (skillLevel) => trackEvent('assessment_completed', { 
    skill_level: skillLevel 
  }),
  lessonStarted: (lessonId, lessonTitle) => trackEvent('lesson_started', {
    lesson_id: lessonId,
    lesson_title: lessonTitle
  }),
  lessonCompleted: (lessonId, lessonTitle, timeSpent) => trackEvent('lesson_completed', {
    lesson_id: lessonId,
    lesson_title: lessonTitle,
    time_spent_seconds: timeSpent
  }),
  
  // AI Sandbox events
  sandboxPromptSubmitted: (lessonId) => trackEvent('sandbox_prompt_submitted', {
    lesson_id: lessonId
  }),
  sandboxCodeRun: (lessonId, language) => trackEvent('sandbox_code_run', {
    lesson_id: lessonId,
    programming_language: language
  }),
  
  // Gamification events
  xpEarned: (amount, source) => trackEvent('xp_earned', {
    xp_amount: amount,
    source: source
  }),
  levelUp: (newLevel) => trackEvent('level_up', {
    new_level: newLevel
  }),
  badgeEarned: (badgeId, badgeName) => trackEvent('badge_earned', {
    badge_id: badgeId,
    badge_name: badgeName
  }),
  streakAchieved: (streakDays) => trackEvent('streak_achieved', {
    streak_days: streakDays
  }),

  // Error tracking
  apiError: (errorType, errorMessage) => {
    trackEvent('api_error', {
      error_type: errorType,
      error_message: errorMessage
    });
    
    // Also send to Sentry
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(new Error(`${errorType}: ${errorMessage}`));
    }
  },

  // Performance tracking
  pageView: (pageName) => {
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        page_title: pageName,
        page_location: window.location.href
      });
    }
  }
};

// Performance monitoring
export const performanceMonitor = {
  // Track lesson loading times
  startLessonLoad: (lessonId) => {
    if (process.env.NODE_ENV === 'production') {
      performance.mark(`lesson-${lessonId}-start`);
    }
  },
  
  endLessonLoad: (lessonId) => {
    if (process.env.NODE_ENV === 'production') {
      performance.mark(`lesson-${lessonId}-end`);
      performance.measure(
        `lesson-${lessonId}-load`,
        `lesson-${lessonId}-start`,
        `lesson-${lessonId}-end`
      );
      
      const measure = performance.getEntriesByName(`lesson-${lessonId}-load`)[0];
      trackEvent('lesson_load_time', {
        lesson_id: lessonId,
        load_time_ms: Math.round(measure.duration)
      });
    }
  },

  // Track AI API response times
  trackAPICall: (provider, duration, success) => {
    trackEvent('ai_api_call', {
      provider: provider,
      duration_ms: duration,
      success: success
    });
  }
};

// Debug mode for development
export const debugAnalytics = process.env.NODE_ENV === 'development' ? {
  log: (event, data) => console.log(`📊 Analytics: ${event}`, data),
  trackEvent: (eventName, parameters) => {
    console.log(`📊 Would track: ${eventName}`, parameters);
  }
} : null; 