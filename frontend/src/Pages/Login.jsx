import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Input from "../Components/Input"
import api from "../api/axios"

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
    <div>
      <h2>Login</h2>

      <Input placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />

      <br /><br />

      <Input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <p>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}

export default Login
