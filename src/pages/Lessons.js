import React from 'react';

function Lessons() {
  return (
    <div className="lessons">
      <div className="container">
        <h1>AI Lessons</h1>
        <div className="lessons-content">
          <div className="lesson-categories">
            <h2>Choose Your Learning Path</h2>
            <div className="categories-grid">
              <div className="category-card">
                <h3>Beginner</h3>
                <p>Start with the basics of AI and programming</p>
                <button className="btn btn-primary">Start Here</button>
              </div>
              <div className="category-card">
                <h3>Intermediate</h3>
                <p>Build projects like games and data analyzers</p>
                <button className="btn btn-primary">Continue Learning</button>
              </div>
              <div className="category-card">
                <h3>Advanced</h3>
                <p>Master complex AI concepts and implementations</p>
                <button className="btn btn-primary">Advanced Topics</button>
              </div>
            </div>
          </div>
          
          <div className="featured-lessons">
            <h2>Featured Lessons</h2>
            <div className="lessons-grid">
              <div className="lesson-card">
                <h3>Build a Pac-Man Game</h3>
                <p>Learn JavaScript/Python while creating a classic game</p>
                <span className="lesson-level">Intermediate</span>
              </div>
              <div className="lesson-card">
                <h3>Data Analyzer Project</h3>
                <p>Build a tool to analyze and visualize data</p>
                <span className="lesson-level">Intermediate</span>
              </div>
              <div className="lesson-card">
                <h3>AI Fundamentals</h3>
                <p>Introduction to artificial intelligence concepts</p>
                <span className="lesson-level">Beginner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lessons; 