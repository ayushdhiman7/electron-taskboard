import React from 'react';

// Full-screen welcome overlay shown on the very first launch.
// The app behind is dimmed and locked until the user clicks the
// "Start the tour" button, which launches the onboarding tour.

export default function Welcome({ onStart }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <h1>Welcome to Task Manager</h1>
        <p>Take a quick tour to learn how to add projects, tasks, and organize your work.</p>
        <button className="welcome-btn" onClick={onStart}>
          Start the tour
        </button>
      </div>
    </div>
  );
}