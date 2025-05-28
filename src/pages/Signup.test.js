import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// DO NOT import AuthProvider from '../contexts/AuthContext' here directly if it's fully mocked below
import Signup from './Signup';

// Mock firebase/app to control initializeApp
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ /* return a minimal mock app object if needed */ 
    name: 'mockedApp',
    // Add other app properties if any code path expects them
  })),
  // Add other exports from firebase/app if they are used and need mocking
}));

// Mock 'firebase/auth' to control onAuthStateChanged behavior
jest.mock('firebase/auth', () => {
  const actualFirebaseAuth = jest.requireActual('firebase/auth');
  return {
    ...actualFirebaseAuth,
    onAuthStateChanged: jest.fn(() => jest.fn()), // Ensure this returns a mock unsubscribe function
    // Other functions like GoogleAuthProvider, signInWithPopup, etc., will use actual implementations
    // unless Signup.js's direct testing needs them mocked, which is handled by useAuth mock.
  };
});

// Mock '../firebase' to provide the necessary auth object structure
jest.mock('../firebase', () => ({
  auth: {}, // The onAuthStateChanged from 'firebase/auth' is mocked, so this can be simple
  googleProvider: {}, // Mock if needed by code paths not covered by useAuth mock
  db: {},             // Mock if needed
  // analytics is globally mocked in setupTests.js
  // app: initializeApp() // This would now call the mocked initializeApp
}));

// Mock firestoreService.js
jest.mock('../services/firestoreService.js', () => ({
  upsertUserProfile: jest.fn(() => Promise.resolve()),
  getUserProfile: jest.fn(() => Promise.resolve(null)), // Or a mock user profile if needed
  // Add other functions exported by firestoreService.js if they get called during import or setup
}));

// Mock the useAuth hook and provide a mock AuthProvider
const mockSignUpWithEmail = jest.fn();
const mockSignInWithGoogle = jest.fn();
// Forward declare mockNavigate if it's used outside the react-router-dom mock scope, or define it within
let mockNavigate = jest.fn(); 

jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: jest.fn(({ children }) => <>{children}</>), // Mock AuthProvider
  useAuth: () => ({
    user: null,
    signUpWithEmail: mockSignUpWithEmail,
    signInWithGoogle: mockSignInWithGoogle,
    // Add any other properties/functions Signup.js might destructure from useAuth
  }),
}));

// Mock react-router-dom (ensure mockNavigate is correctly scoped or redefined)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // mockNavigate should be defined in a scope accessible here
}));

// Now, we can import the mocked AuthProvider for use in render
// This will come from the jest.mock above
const { AuthProvider } = require('../contexts/AuthContext');

// Mock Navbar
jest.mock('../components/Navbar', () => () => <div data-testid="mock-navbar">Mock Navbar</div>);

describe('Signup Page', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockSignUpWithEmail.mockClear();
    mockSignInWithGoogle.mockClear();
    mockNavigate.mockClear();
    // If AuthProvider is a jest.fn(), you can clear it too if needed: AuthProvider.mockClear();
  });

  test('renders signup form correctly', () => {
    render(
      <Router>
        <AuthProvider> {/* This is now the mocked AuthProvider */}
          <Signup />
        </AuthProvider>
      </Router>
    );
    screen.debug(); // Add this line to see what is rendered

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument(); // Use regex for exact match on "Password"
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start free trial/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /start free trial/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockSignUpWithEmail).not.toHaveBeenCalled();
  });

  test('shows error for password less than 6 characters', async () => {
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /start free trial/i }));

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(mockSignUpWithEmail).not.toHaveBeenCalled();
  });

  test('calls signUpWithEmail on successful submission with valid password', async () => {
    mockSignUpWithEmail.mockResolvedValueOnce({ user: { uid: '123', email: 'test@example.com' } }); // Mock a successful signup

    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /start free trial/i }));

    await waitFor(() => expect(mockSignUpWithEmail).toHaveBeenCalledWith('test@example.com', 'password123'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/home'));
  });

  test('calls signInWithGoogle when Google signup button is clicked', async () => {
    mockSignInWithGoogle.mockResolvedValueOnce({ user: { uid: '456', email: 'googleuser@example.com' } }); // Mock successful Google sign-in
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/home'));
  });

  test('redirects if user is already logged in', () => {
    // Override the useAuth mock for this specific test
    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockImplementationOnce(() => ({
        user: { uid: 'testUser', emailVerified: true }, // Mock a logged-in user
        signUpWithEmail: mockSignUpWithEmail,
        signInWithGoogle: mockSignInWithGoogle,
    }));
    
    render(
        <Router>
            <AuthProvider> {/* AuthProvider might be redundant here if useAuth is fully mocked */}
                <Signup />
            </AuthProvider>
        </Router>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
  });

}); 