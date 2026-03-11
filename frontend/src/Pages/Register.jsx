import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import api from "../api/axios";
import "../styles/register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister() {

    // empty validation
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    // email validation
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    // password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(res.data.message || "Registration successful!");

      navigate("/login");

    } catch (err) {

      console.error(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed");
      }

    }

  }

  return (
    <div className="register-container">

      <div className="register-card">

        <h2>Create Account</h2>

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>
          Register
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
