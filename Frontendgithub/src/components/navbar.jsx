import React from 'react';
import '../style/navbar.css';
import { Link, useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const navigate = useNavigate();

  
  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Left side - Sourabh button */}
      <div className="navbar-left">
        <Link to="/" className="nav-button-link">
          <button className="nav-button">Sourabh</button>
        </Link>
      </div>

      {/* Center - Start Repo button */}
      <div className="navbar-center">
        <button className="nav-button">Start Repo</button>
      </div>

      {/* Right side - Sign In / Logout buttons */}
      <div className="navbar-right">
        <button className="nav-button">Sign In</button>
        <button className="nav-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
