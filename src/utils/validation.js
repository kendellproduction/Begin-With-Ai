export const checkPasswordStrength = (password) => {
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  };
  const strength = Object.values(criteria).filter(Boolean).length;
  let message = 'Password is weak.';
  if (strength === 5) message = 'Password is very strong.';
  else if (strength >= 4) message = 'Password is strong.';
  else if (strength >= 3) message = 'Password is medium.';
  
  return { criteria, strength, message };
};

// You can add other validation functions here in the future, for example:
// export const isValidEmail = (email) => { ... }; 