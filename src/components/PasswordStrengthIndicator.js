import React from 'react';

const PasswordStrengthIndicator = ({ strengthDetails }) => {
  if (!strengthDetails || !strengthDetails.criteria) {
    return null; // Or some default state if password hasn't been typed
  }

  const { criteria, message } = strengthDetails;

  const criteriaMessages = [
    { key: 'length', text: 'At least 8 characters', met: criteria.length },
    { key: 'uppercase', text: 'An uppercase letter', met: criteria.uppercase },
    { key: 'lowercase', text: 'A lowercase letter', met: criteria.lowercase },
    { key: 'number', text: 'A number', met: criteria.number },
    { key: 'specialChar', text: 'A special character', met: criteria.specialChar },
  ];

  // Determine bar color based on strength message
  let barColor = 'bg-gray-500'; // Default/Weak
  if (message === 'Password is very strong.') {
    barColor = 'bg-green-500';
  } else if (message === 'Password is strong.') {
    barColor = 'bg-blue-500';
  } else if (message === 'Password is medium.') {
    barColor = 'bg-yellow-500';
  }
  // Weak remains gray or you can explicitly set it to red, e.g., bg-red-500

  const strengthPercentage = (Object.values(criteria).filter(Boolean).length / 5) * 100;

  return (
    <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <p className={`text-sm font-medium mb-2 ${message === 'Password is very strong.' ? 'text-green-400' : message === 'Password is strong.' ? 'text-blue-400' : message === 'Password is medium.' ? 'text-yellow-400' : 'text-red-400'}`}>
        Password strength: {message}
      </p>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3">
        <div 
          className={`h-2.5 rounded-full ${barColor} transition-all duration-300 ease-in-out`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>
      <ul className="space-y-1">
        {criteriaMessages.map((item) => (
          <li key={item.key} className={`text-xs flex items-center ${item.met ? 'text-green-400' : 'text-red-400'}`}>
            {item.met ? (
              <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator; 