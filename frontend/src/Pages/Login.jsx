import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import "./Login.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const res = await api.post("/login", {
        email,
        password
      })

      console.log(res.data)
      navigate("/dashboard")
    } catch (err) {
      alert("Login failed")
    }
  }

 return (
  <div className="login-container">
    <div className="login-wrapper">

      <div className="login-brand">
        <h1>
          <span className="mock-dark">Mock</span>
          <span className="mock-accent">Mate</span>
        </h1>
        <p>Practice Smarter. Perform Better.</p>
      </div>

      <div className="login-form">
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-button"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>

      <div className="login-footer">
        New here?{" "}
        <Link to="/register" className="login-link">
          Create account
        </Link>
      </div>

    </div>
  </div>
)
 
}

export default Login
