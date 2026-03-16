import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

//import { ThemeProvider } from "../context/ThemeContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const {theme,toggleTheme}=useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="nav-left" onClick={() => navigate("/dashboard")}>
        <span className="logo">MockMate</span>
      </div>

      <div className="nav-right">
        <span className="nav-link" onClick={() => navigate("/dashboard")}>
          Dashboard
        </span>

        <span className="nav-link" onClick={() => navigate("/results")}>
          Results
        </span>

        {user && <span className="user-name">{user.name}</span>}

        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
        <button
className="theme-toggle"
onClick={toggleTheme}
>

{theme === "dark" ? "🌙 Dark" : "☀ Light"}

</button>
      </div>
    </div>
  );
};

export default Navbar;