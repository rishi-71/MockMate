import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Input from "../components/Input"
import api from "../api/axios"

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

    navigate("/")
  } catch (err) {
    console.error(err)
    alert("Registration failed")
  }
}

  return (
    <div>
      <h2>Register</h2>

      <Input placeholder="Name" value={name}
        onChange={(e) => setName(e.target.value)} />

      <br /><br />

      <Input placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />

      <br /><br />

      <Input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <br /><br />

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  )
}

export default Register
