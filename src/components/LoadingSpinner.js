import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', variant = 'default' }) => {
  const spinnerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  };

  const spinnerCircleStyles = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  };

  const messageStyles = {
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
  };

  const pageSpinnerStyles = {
    ...spinnerStyles,
    height: '100vh',
    position: 'fixed',
  };

  const finalStyles = variant === 'page' ? pageSpinnerStyles : spinnerStyles;

  return (
    <div style={finalStyles}>
      <div style={spinnerCircleStyles}></div>
      {message && <p style={messageStyles}>{message}</p>}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner; 