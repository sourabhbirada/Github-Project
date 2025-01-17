import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authcontext';
import { Link, useNavigate } from 'react-router-dom';
import {URL_MAIN } from '../../utiltis/content';

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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true)
    try {
        
        const res = await axios.post(`${URL_MAIN}/signup`, {
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">Create an account</h1>
          <p className="text-zinc-400 text-sm mt-2">Sign up to get started</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm text-zinc-400">Full Name</label>
            <input
              id="name"
              type="text"
              value={username}
              placeholder="John Doe"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-zinc-400">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="text-sm text-zinc-400">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            
          >
            Create Account
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">OR SIGN UP WITH</span>
            </div>
          </div>

          <button 
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-white py-2 rounded-md hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            Sign up with Google
          </button>

          <div className="text-center">
            <div className="text-zinc-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
