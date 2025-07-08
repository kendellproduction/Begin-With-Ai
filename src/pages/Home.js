import React from 'react';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to BeginningWithAi</h1>
          <p>Interactive AI learning platform with adaptive lessons and hands-on coding exercises</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Start Learning</button>
            <button className="btn btn-secondary">View Lessons</button>
          </div>
        </div>
      </section>
      
      <section className="features">
        <h2>What You'll Learn</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI Fundamentals</h3>
            <p>Learn the basics of artificial intelligence and machine learning</p>
          </div>
          <div className="feature-card">
            <h3>Hands-on Coding</h3>
            <p>Build real projects like games and data analyzers</p>
          </div>
          <div className="feature-card">
            <h3>Interactive Lessons</h3>
            <p>Get real-time feedback and personalized learning paths</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 