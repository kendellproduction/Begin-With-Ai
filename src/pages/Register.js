import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Implement Firebase authentication
    console.log('Registration attempt:', { email, password });
  };

  return (
    <div className="register">
      <div className="container">
        <div className="auth-form">
          <h1>Register for BeginningWithAi</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
          
          <div className="auth-options">
            <p>Already have an account? <a href="/login">Login here</a></p>
            <div className="social-login">
              <button className="btn btn-google">Register with Google</button>
              <button className="btn btn-apple">Register with Apple</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 