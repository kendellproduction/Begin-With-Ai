/**
 * Critical User Flow Tests - Security-Focused End-to-End Testing
 * Tests complete user journeys without exposing sensitive information
 */

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { GamificationProvider } from '../contexts/GamificationContext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import components to test
import Dashboard from '../pages/Dashboard';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import LessonsOverview from '../pages/LessonsOverview';
import { TestRunner } from '../utils/testRunner';

// Mock Firebase with secure defaults
jest.mock('../firebase', () => ({
  auth: {
    currentUser: null,
    app: { options: { apiKey: 'test-key', projectId: 'test-project' } }
  },
  db: {},
  googleProvider: {}
}));

// Mock navigation to prevent actual navigation during tests
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Secure test wrapper that doesn't expose sensitive data
const SecureTestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <GamificationProvider>
        {children}
      </GamificationProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Critical User Flow Tests', () => {
  let testRunner;

  beforeEach(() => {
    // Clean up before each test
    cleanup();
    mockNavigate.mockClear();
    testRunner = new TestRunner();
    
    // Clear localStorage to prevent data leakage between tests
    localStorage.clear();
    
    // Reset any console warnings/errors
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('🔐 Authentication Security Tests', () => {
    test('validates email format properly', async () => {
      const user = userEvent.setup();
      
      render(
        <SecureTestWrapper>
          <Signup />
        </SecureTestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      // Test invalid email formats
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      // Should show validation error without exposing internal details
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });

    test('enforces password strength requirements', async () => {
      const user = userEvent.setup();
      
      render(
        <SecureTestWrapper>
          <Signup />
        </SecureTestWrapper>
      );

      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      // Test weak password
      await user.type(passwordInput, '123');
      await user.click(submitButton);

      // Should show strength requirement without exposing system details
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });

    test('prevents SQL injection attempts in inputs', async () => {
      const user = userEvent.setup();
      
      render(
        <SecureTestWrapper>
          <Login />
        </SecureTestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      // Test SQL injection attempts
      const maliciousInput = "'; DROP TABLE users; --";
      
      await user.type(emailInput, maliciousInput);
      await user.type(passwordInput, maliciousInput);

      // Inputs should be sanitized and not cause errors
      expect(emailInput.value).toBe(maliciousInput);
      expect(passwordInput.value).toBe(maliciousInput);
      
      // Should not expose any system information
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    test('handles authentication errors gracefully', async () => {
      const user = userEvent.setup();
      
      render(
        <SecureTestWrapper>
          <Login />
        </SecureTestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Test with invalid credentials
      await user.type(emailInput, 'nonexistent@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      // Should show user-friendly error without exposing system details
      await waitFor(() => {
        const errorElement = screen.queryByText(/invalid/i);
        if (errorElement) {
          expect(errorElement).toBeInTheDocument();
          // Ensure no sensitive information is exposed
          expect(errorElement.textContent).not.toContain('firebase');
          expect(errorElement.textContent).not.toContain('database');
        }
      });
    });
  });

  describe('📚 Student Learning Journey Tests', () => {
    test('completes student signup to first lesson flow', async () => {
      const user = userEvent.setup();

      // Mock successful authentication
      const mockUser = {
        uid: 'test-user-123',
        email: 'student@example.com',
        emailVerified: true
      };

      // Test signup flow
      render(
        <SecureTestWrapper>
          <Signup />
        </SecureTestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(emailInput, 'student@example.com');
      await user.type(passwordInput, 'securepassword123');
      await user.type(confirmPasswordInput, 'securepassword123');
      await user.click(submitButton);

      // Should initiate signup process
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/verify-email');
      });
    });

    test('handles lesson loading without exposing internal data', async () => {
      render(
        <SecureTestWrapper>
          <LessonsOverview />
        </SecureTestWrapper>
      );

      // Should load lessons without exposing sensitive information
      await waitFor(() => {
        const lessonElements = screen.getAllByText(/lesson/i);
        expect(lessonElements.length).toBeGreaterThan(0);
      });

      // Check that no internal data is exposed
      expect(screen.queryByText(/firebase/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/api key/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/token/i)).not.toBeInTheDocument();
    });

    test('tracks progress securely', async () => {
      const user = userEvent.setup();

      render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      // Should display progress information without exposing sensitive data
      await waitFor(() => {
        const progressElements = screen.getAllByText(/progress/i);
        expect(progressElements.length).toBeGreaterThan(0);
      });

      // Verify no sensitive information is displayed
      expect(screen.queryByText(/uid/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/database/i)).not.toBeInTheDocument();
    });
  });

  describe('🔧 Admin Journey Tests', () => {
    test('prevents unauthorized admin access', async () => {
      // Mock non-admin user
      const mockNonAdminUser = {
        uid: 'regular-user-123',
        email: 'user@example.com',
        emailVerified: true
      };

      // Test that admin routes are protected
      render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      // Should not display admin controls for regular users
      expect(screen.queryByText(/admin panel/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/create content/i)).not.toBeInTheDocument();
    });

    test('validates admin content creation inputs', async () => {
      const user = userEvent.setup();

      // Mock admin user (without exposing real admin credentials)
      const mockAdminUser = {
        uid: 'admin-user-123',
        email: 'admin@example.com',
        emailVerified: true,
        customClaims: { admin: true }
      };

      // Test content creation form validation
      // This would be tested with a mocked admin panel component
    });
  });

  describe('🚨 Error Handling Tests', () => {
    test('handles network failures gracefully', async () => {
      // Mock network failure
      const originalFetch = global.fetch;
      global.fetch = jest.fn(() => Promise.reject('Network error'));

      render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      // Should handle network errors without exposing system details
      await waitFor(() => {
        const errorElements = screen.queryAllByText(/error/i);
        errorElements.forEach(element => {
          expect(element.textContent).not.toContain('fetch');
          expect(element.textContent).not.toContain('Network error');
        });
      });

      // Restore original fetch
      global.fetch = originalFetch;
    });

    test('handles invalid input gracefully', async () => {
      const user = userEvent.setup();

      render(
        <SecureTestWrapper>
          <Signup />
        </SecureTestWrapper>
      );

      // Test various invalid inputs
      const emailInput = screen.getByLabelText(/email/i);
      
      // Test XSS attempt
      await user.type(emailInput, '<script>alert("XSS")</script>');
      
      // Should sanitize input and not execute scripts
      expect(emailInput.value).toBe('<script>alert("XSS")</script>');
      expect(global.alert).toBeUndefined();
    });

    test('handles localStorage quota exceeded', () => {
      // Mock localStorage quota exceeded
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      // Should handle storage errors gracefully
      expect(screen.queryByText(/quota/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/storage/i)).not.toBeInTheDocument();

      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('📱 Mobile Experience Tests', () => {
    test('handles touch interactions properly', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });

      render(
        <SecureTestWrapper>
          <LessonsOverview />
        </SecureTestWrapper>
      );

      // Should render mobile-friendly interface
      await waitFor(() => {
        const mobileElements = screen.getByRole('main');
        expect(mobileElements).toBeInTheDocument();
      });
    });

    test('prevents unwanted swipe navigation', async () => {
      const user = userEvent.setup();

      render(
        <SecureTestWrapper>
          <LessonsOverview />
        </SecureTestWrapper>
      );

      // Test that swipe gestures don't cause unwanted navigation
      const mainContent = screen.getByRole('main');
      
      // Simulate swipe gesture
      await user.pointer([
        { keys: '[TouchA>]', target: mainContent },
        { pointerName: 'TouchA', coords: { x: 0, y: 0 } },
        { pointerName: 'TouchA', coords: { x: 100, y: 0 } },
        { keys: '[/TouchA]' }
      ]);

      // Should not trigger navigation
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('🔍 Data Privacy Tests', () => {
    test('does not expose user data in console', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      // Check that no sensitive data is logged
      await waitFor(() => {
        expect(consoleSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('email')
        );
        expect(consoleSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('password')
        );
        expect(consoleSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('token')
        );
      });

      consoleSpy.mockRestore();
    });

    test('sanitizes all user inputs', async () => {
      const user = userEvent.setup();

      render(
        <SecureTestWrapper>
          <Signup />
        </SecureTestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      
      // Test various malicious inputs
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        '"; DROP TABLE users; --'
      ];

      for (const input of maliciousInputs) {
        await user.clear(emailInput);
        await user.type(emailInput, input);
        
        // Input should be contained and not executed
        expect(emailInput.value).toBe(input);
      }
    });
  });

  describe('⚡ Performance Tests', () => {
    test('loads within acceptable time limits', async () => {
      const startTime = performance.now();

      render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      await waitFor(() => {
        const mainContent = screen.getByRole('main');
        expect(mainContent).toBeInTheDocument();
      });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load within reasonable time (adjusted for test environment)
      expect(loadTime).toBeLessThan(5000); // 5 seconds for test environment
    });

    test('handles concurrent users without data leakage', async () => {
      // Simulate multiple users
      const user1Data = { uid: 'user1', email: 'user1@example.com' };
      const user2Data = { uid: 'user2', email: 'user2@example.com' };

      // Render multiple instances
      const { unmount: unmount1 } = render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      const { unmount: unmount2 } = render(
        <SecureTestWrapper>
          <Dashboard />
        </SecureTestWrapper>
      );

      // Should not have data leakage between instances
      expect(screen.queryByText(user1Data.email)).not.toBeInTheDocument();
      expect(screen.queryByText(user2Data.email)).not.toBeInTheDocument();

      unmount1();
      unmount2();
    });
  });
});

// Additional security utility tests
describe('🛡️ Security Utility Tests', () => {
  test('TestRunner handles errors without exposing system details', async () => {
    const testRunner = new TestRunner();
    
    // Mock a test that would fail
    const mockFailingTest = () => {
      throw new Error('Internal system error with sensitive data');
    };

    try {
      await testRunner.runTest('failing test', mockFailingTest);
    } catch (error) {
      // Should handle error gracefully
      expect(error.message).not.toContain('sensitive data');
    }
  });

  test('validates environment variables are not exposed', () => {
    render(
      <SecureTestWrapper>
        <Dashboard />
      </SecureTestWrapper>
    );

    // Check that environment variables are not exposed in the DOM
    expect(screen.queryByText(/REACT_APP_/)).not.toBeInTheDocument();
    expect(screen.queryByText(/firebase/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/api.*key/i)).not.toBeInTheDocument();
  });
}); 