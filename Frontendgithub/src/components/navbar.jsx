import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center">
              <Link to="/">
                <span className="text-xl font-bold text-white hover:text-blue-400 
                               transition-colors duration-200">
                  Lost
                </span>
              </Link>
            </div>

            
            <div className={`flex-1 mx-8 transition-all duration-300 ease-in-out 
                            ${isSearchOpen ? 'opacity-100 max-w-xl' : 'opacity-0 max-w-0 md:opacity-100 md:max-w-xl'}`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2
                           border border-gray-700 focus:border-blue-500 focus:ring-1 
                           focus:ring-blue-500 transition-all duration-200
                           placeholder-gray-400"
                />
              </div>
            </div>

            
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden px-3 py-2 text-gray-300 hover:text-white 
                       transition-colors duration-200"
            >
              {isSearchOpen ? 'Close' : 'Search'}
            </button>

            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/about" 
                    className="text-gray-300 hover:text-white transition-colors 
                             duration-200 hover:scale-105 transform">
                About
              </Link>
              <Link to="/contact"
                    className="text-gray-300 hover:text-white transition-colors 
                             duration-200 hover:scale-105 transform">
                Contact
              </Link>
              <button
                onClick={userId ? handleLogout : () => (window.location.href = '/login')}
                className="px-4 py-2 rounded-lg font-medium text-white
             bg-blue-600 hover:bg-blue-700 transition-all duration-200
             transform hover:-translate-y-0.5 hover:shadow-lg">
                {userId ? "Logout" : "Login"}
              </button>
              

            </div>


            <div className="md:hidden flex items-center">
              <button className="text-gray-300 hover:text-white p-2">
                Menu
              </button>
            </div>
          </div>
        </div>
      </nav>

      
      <div className="pt-16">
       
      </div>
    </>
  );
};

export default Navbar;
