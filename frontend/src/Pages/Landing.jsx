import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";
import { ThemeContext } from "../context/ThemeContext";

const Landing = () => {
  const [theme, setTheme] = useState(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={`landing ${theme}`}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">MockMate</div>
        <div className="nav-links">
          <a href="#hero" className="hide-mobile">Home</a>
          <a href="#stats" className="hide-mobile">Stats</a>
          <a href="#features" className="hide-mobile">Features</a>
          <a href="#how" className="hide-mobile">How it Works</a>
          
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-container">
          <div className="hero-left">
            <h1>Master Coding Interviews with <span>AI</span></h1>
            <p>
              Practice coding problems, generate quizzes dynamically from your syllabus, 
              and get intelligent hints while solving them in our built-in editor.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">Start Practicing</Link>
              <Link to="/login" className="btn-outline">Login</Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="code-window">
              <div className="window-bar">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <pre>
{`function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="stats">
        <div className="stats-container">
          <div className="stat">
            <h3>10K+</h3>
            <p>Questions Generated</p>
          </div>
          <div className="stat">
            <h3>5K+</h3>
            <p>Students Practicing</p>
          </div>
          <div className="stat">
            <h3>AI</h3>
            <p>Powered Learning</p>
          </div>
          <div className="stat">
            <h3>100+</h3>
            <p>Topics Covered</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI Coding Questions</h3>
            <p>Generate unique coding problems dynamically based on your skill level.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Code Editor</h3>
            <p>Practice coding directly inside our robust built-in browser editor.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>AI Hints</h3>
            <p>Get contextual hints to unblock you without revealing the final answer.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Theory Quiz</h3>
            <p>Upload your syllabus and instantly generate comprehensive theory quizzes.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how">
        <h2>How It Works</h2>
        <div className="how-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload</h3>
            <p>Provide your syllabus or target topics.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Generate</h3>
            <p>AI creates custom quizzes and problems.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Solve</h3>
            <p>Tackle questions in the built-in editor.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Learn</h3>
            <p>Use AI hints to understand concepts deeply.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to level up your coding skills?</h2>
          <p>Join thousands of students preparing for their next big interview.</p>
          <Link to="/register" className="btn-primary cta-btn">Start Practicing Now</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="logo">MockMate</div>
          <p>© 2026 MockMate AI Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;