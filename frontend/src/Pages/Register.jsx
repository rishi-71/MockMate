import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Input from "../components/Input"
import api from "../api/axios"
import "../styles/register.css";

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleRegister() {


    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      })

      navigate("/login");
    } catch (err) {
      alert("Registration failed");
      console.log(err);
    }

  }
}

  return (
  <div className="register-container">

    <div className="register-card">

      <h2 className="register-title">Register</h2>

      <div className="register-form">

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

        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>

  </div>
)
}

export default Register
