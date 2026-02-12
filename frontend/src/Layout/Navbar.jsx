import { Link } from "react-router-dom"
import "./Navbar.css"

function Navbar({ theme, setTheme }) {

  function toggleTheme() {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  return (
    <nav className="navbar">
      <h2 className="logo">
        <span className="logo-dark">Mock</span>
        <span className="logo-accent">Mate</span>
      </h2>

      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/quiz" className="nav-link">Quiz</Link>
        <Link to="/result" className="nav-link">Result</Link>

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
