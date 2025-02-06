import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authcontext';
import '../../index.css';
import { URL_MAIN } from '../../utiltis/content';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentuser, setcurrentuser } = useAuth();
  const [error , setError] = useState('')
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
      const res = await axios.post(`${URL_MAIN}/user/login`,  {
        email: email,
        password: password,
        
      }, { headers: {
        
        'Content-Type': 'application/json',
        
      },
      withCredentials: true
       });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setcurrentuser(res.data.userId);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        
        if (error.response) {
          setError(error.response.data.message || 'An error occurred during signup.');
        } else if (error.request) {
          setError('No response received from server. Please try again.');
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-zinc-400 text-sm mt-2">Enter your credentials to access your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {loading?'Singing' : "Sing In"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">OR CONTINUE WITH</span>
            </div>
          </div>

          <button 
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-white py-2 rounded-md hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            Continue with Google
          </button>

          <div className="text-center space-y-2">
            <Link href="/new" className="text-sm text-indigo-400 hover:text-indigo-300">
              Forgot your password?
            </Link>
            <div className="text-zinc-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
