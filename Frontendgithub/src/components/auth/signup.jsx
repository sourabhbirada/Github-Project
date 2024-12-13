import React, { useState } from 'react';
import '../../style/signup.css';
import axios from 'axios';
import { useAuth } from '../../authcontext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading , setLoading] = useState(false)
  const { currentuser, setcurrentuser } = useAuth();
  const navigate = useNavigate()

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true)

        const res = await axios.post("https://github-project-k4z5.onrender.com/signup" , {
            email: email,
            password:password,
            username:username
        })
        const token = res.data.token;
        const userId = res.data.userId;

        localStorage.setItem("token" , token)
        localStorage.setItem('userId' , userId)

        setcurrentuser(userId)
        setLoading(false)

        navigate('/')

    } catch (error) {
        console.log(error);
        setLoading(false)
    }

    
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
        </div>

        <button type="submit" className="signup-btn"
        disabled={loading} >
            {loading ? "loading....." : "signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
