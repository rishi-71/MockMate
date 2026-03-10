import { useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {

    // empty field check
    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {

      const res = await axios.post("/api/auth/login", {   // ✅ FIXED
        email,
        password,
      });

      login(res.data);

      alert("Login successful");

      navigate("/dashboard");

    } catch (err) {

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed");
      }

      console.log(err);
    }
  };

  return (
   <div className="auth-wrapper">
    <div className="card auth-card">

      <h2 className="title">Login</h2>

      <input
        className="input"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        className="input"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />

      <button className="btn" onClick={handleLogin}>
        Login
      </button>

    </div>
   </div>
  );
};

export default Login;