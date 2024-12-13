import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../authcontext';
import '../../style/login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentuser, setcurrentuser } = useAuth();
  const navigate = useNavigate(); 

  
  useEffect(() => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setcurrentuser(null);
  }, []); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://github-project-k4z5.onrender.com/login", {
        email: email,
        password: password
      });

      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      console.log(res.data.userId);
      

      
      setcurrentuser(res.data.userId);

      
      navigate('/'); 

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handelsignin =  async () => {
    navigate('/signup')
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Username or email address</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter username or email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="signin-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div>
        <button  onClick={handelsignin}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
