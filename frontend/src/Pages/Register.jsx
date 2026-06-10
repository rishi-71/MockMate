import { useState } from "react";
import  api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css"; // Note the updated CSS import

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents page reload
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // Optionally show a success message before redirecting
      navigate("/login");
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        
        <div className="register-header">
          <div className="logo mockmate-logo">MockMate</div>
          <h2>Create Account</h2>
          <p>Join thousands of students practicing daily.</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              className="register-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              className="register-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="register-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login" className="register-link">Log in</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;