import { Link } from "react-router-dom";
import "../styles/landing.css";

const Landing = () => {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <h2 className="logo">MockMate</h2>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/register" className="nav-btn-outline">Register</Link>
        </div>
      </nav>


      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          AI Powered Coding Practice Platform
        </h1>

        <p>
          Practice coding problems, get AI hints, take theory quizzes and track your progress.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </section>


      {/* FEATURES */}
      <section id="features" className="features">

        <h2>Features</h2>

        <div className="features-grid">

          <div className="feature-card">
            <h3>AI Coding Questions</h3>
            <p>Generate coding problems dynamically using AI.</p>
          </div>

          <div className="feature-card">
            <h3>Code Editor</h3>
            <p>Practice coding inside a built-in Monaco code editor.</p>
          </div>

          <div className="feature-card">
            <h3>AI Hints</h3>
            <p>Get smart hints without revealing the full solution.</p>
          </div>

          <div className="feature-card">
            <h3>Theory Quiz</h3>
            <p>Upload syllabus and generate quizzes automatically.</p>
          </div>

        </div>

      </section>


      {/* ABOUT */}
      <section id="about" className="about">

        <h2>About MockMate</h2>

        <p>
          MockMate is an AI-driven learning platform designed to help students
          practice coding problems and theory quizzes efficiently.
          It combines AI-generated problems, a code editor, and performance tracking
          to simulate real technical interview preparation.
        </p>

      </section>


      {/* CONTACT */}
      <section id="contact" className="contact">

        <h2>Contact</h2>

        <p>Email: support@mockmate.dev</p>
        <p>GitHub: github.com/mockmate</p>

      </section>


      {/* FOOTER */}
      <footer className="footer">
        © 2026 MockMate — AI Learning Platform
      </footer>

    </div>
  );
};

export default Landing;