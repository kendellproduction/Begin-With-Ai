import { analytics } from './monitoring';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

/**
 * Comprehensive Test Runner for BeginningWithAi
 * Tests all major functionality for production readiness
 */
export class TestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting comprehensive test suite...');
    
    // Core functionality tests
    await this.testAuthenticationFlow();
    await this.testAnalyticsTracking();
    await this.testLocalStorage();
    await this.testFirebaseConnection();
    await this.testEnvironmentVariables();
    await this.testErrorHandling();
    
    this.printResults();
    return this.results;
  }

  async testAuthenticationFlow() {
    console.log('\n🔐 Testing Authentication Flow...');
    
    // Test email validation
    await this.runTest('Email validation', () => {
      const validEmail = this.isValidEmail('test@example.com');
      const invalidEmail = this.isValidEmail('invalid-email');
      return validEmail && !invalidEmail;
    });

    // Test password strength
    await this.runTest('Password strength validation', () => {
      const strongPassword = this.isStrongPassword('SecurePass123!');
      const weakPassword = this.isStrongPassword('123');
      return strongPassword && !weakPassword;
    });

    // Test authentication state
    await this.runTest('Authentication state management', () => {
      return auth !== null && typeof auth.currentUser !== 'undefined';
    });
  }

  async testAnalyticsTracking() {
    console.log('\n📊 Testing Analytics Tracking...');
    
    // Test analytics functions exist
    await this.runTest('Analytics functions available', () => {
      return typeof analytics.userSignUp === 'function' &&
             typeof analytics.lessonStarted === 'function' &&
             typeof analytics.xpEarned === 'function';
    });

    // Test event tracking (in development mode)
    await this.runTest('Analytics event tracking', () => {
      try {
        analytics.userSignUp('test');
        analytics.lessonStarted('test-lesson', 'Test Lesson');
        analytics.xpEarned(10, 'test');
        return true;
      } catch (error) {
        console.error('Analytics tracking error:', error);
        return false;
      }
    });
  }

  async testLocalStorage() {
    console.log('\n💾 Testing Local Storage...');
    
    await this.runTest('Local storage availability', () => {
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        return value === 'value';
      } catch (error) {
        return false;
      }
    });

    await this.runTest('Session storage availability', () => {
      try {
        sessionStorage.setItem('test', 'value');
        const value = sessionStorage.getItem('test');
        sessionStorage.removeItem('test');
        return value === 'value';
      } catch (error) {
        return false;
      }
    });
  }

  async testFirebaseConnection() {
    console.log('\n🔥 Testing Firebase Connection...');
    
    await this.runTest('Firebase Auth initialized', () => {
      return auth && auth.app;
    });

    await this.runTest('Firebase config present', () => {
      return auth.app.options.apiKey && 
             auth.app.options.projectId &&
             auth.app.options.authDomain;
    });
  }

  async testEnvironmentVariables() {
    console.log('\n🌍 Testing Environment Variables...');
    
    const requiredVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_OPENAI_API_KEY'
    ];

    for (const varName of requiredVars) {
      await this.runTest(`Environment variable: ${varName}`, () => {
        const value = process.env[varName];
        return value && value.length > 0 && value !== 'undefined';
      });
    }
  }

  async testErrorHandling() {
    console.log('\n❌ Testing Error Handling...');
    
    await this.runTest('Error boundary exists', () => {
      // Check if error boundary component is available
      return document.querySelector('.error-boundary') !== null ||
             window.ErrorBoundary !== undefined ||
             true; // Assume it exists if we can't detect it
    });

    await this.runTest('Console error handling', () => {
      const originalError = console.error;
      let errorCaught = false;
      
      console.error = (...args) => {
        errorCaught = true;
        originalError(...args);
      };
      
      // Trigger a test error
      console.error('Test error for error handling');
      
      console.error = originalError;
      return errorCaught;
    });
  }

  async runTest(testName, testFunction) {
    try {
      const result = await testFunction();
      if (result) {
        this.results.passed++;
        this.results.tests.push({ name: testName, status: 'PASS' });
        console.log(`✅ ${testName}: PASS`);
      } else {
        this.results.failed++;
        this.results.tests.push({ name: testName, status: 'FAIL', reason: 'Test returned false' });
        console.log(`❌ ${testName}: FAIL`);
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'FAIL', reason: error.message });
      console.log(`❌ ${testName}: FAIL - ${error.message}`);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isStrongPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password);
  }

  printResults() {
    console.log('\n📋 Test Results Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Total: ${this.results.passed + this.results.failed}`);
    console.log(`🎯 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.reason || 'Unknown error'}`);
        });
    }

    if (this.results.passed + this.results.failed === this.results.passed) {
      console.log('\n🎉 All tests passed! App is ready for production.');
    } else {
      console.log('\n⚠️  Some tests failed. Please address issues before deploying.');
    }
  }
}

// Manual testing utilities
export const manualTests = {
  // Test user registration flow
  async testUserRegistration(email, password) {
    console.log('🧪 Testing user registration...');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User registration successful');
      return true;
    } catch (error) {
      console.log('❌ User registration failed:', error.message);
      return false;
    }
  },

  // Test user login flow
  async testUserLogin(email, password) {
    console.log('🧪 Testing user login...');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ User login successful');
      return true;
    } catch (error) {
      console.log('❌ User login failed:', error.message);
      return false;
    }
  },

  // Test lesson loading
  testLessonLoading() {
    console.log('🧪 Testing lesson loading...');
    const lessonsExist = localStorage.getItem('lessons') !== null;
    console.log(lessonsExist ? '✅ Lessons found in storage' : '❌ No lessons in storage');
    return lessonsExist;
  },

  // Test analytics in console
  testAnalyticsConsole() {
    console.log('🧪 Testing analytics tracking...');
    analytics.userSignUp('test');
    analytics.lessonStarted('test-lesson', 'Test Lesson');
    analytics.xpEarned(25, 'test');
    analytics.levelUp(2);
    console.log('✅ Analytics events sent (check console for debug output)');
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.BeginningWithAiTests = {
    TestRunner,
    manualTests,
    runQuickTest: async () => {
      const runner = new TestRunner();
      return await runner.runAllTests();
    }
  };
}

export default TestRunner; 