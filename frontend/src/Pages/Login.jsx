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

    // empty validation
    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {

      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      // save token
      localStorage.setItem("token", res.data.token);

      login(res.data);

      //alert(res.data.message || "Login successful");

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      if (err.response?.data?.message) {
       // alert(err.response.data.message);
      } else {
        alert("Login failed");
      }

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