import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Register = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

    if(!name || !email || !password){
      alert("All fields are required");
      return;
    }

    try{

      const res = await axios.post("/auth/register",{
        name,
        email,
        password
      });

      alert(res.data.message || "Registration successful");

      navigate("/login");

    }
    catch(err){

      console.log(err);

      if(err.response?.data?.message){
        alert(err.response.data.message);
      }
      else{
        alert("Registration failed");
      }

    }

  };

  return (

    <div className="auth-wrapper">

      <div className="card auth-card register-card">

        <h2 className="title">Create Account</h2>

        <div className="form-group">

          <input
            className="input"
            placeholder="Name"
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
          />

        </div>

        <button className="btn" onClick={handleRegister}>
          Register
        </button>

        <div className="account-section">

          <p>
            Already have an account?
            <Link className="auth-link" to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>

  );
};

export default Register;