import React, { useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { useAuth } from './authcontext'; 
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import Dashboard from './components/dashbord/dashbord';
import Navbar from './components/navbar';
import CreateRepo from './components/dashbord/createrepo';
import Profile from './components/user/profile';
import RepoDetail from './components/dashbord/repodeits';

const AppRoutes = () => {
  const { currentuser, setcurrentuser } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId && !currentuser) {
      setcurrentuser(userId);
    }

    if (!userId && !['/login', '/signup'].includes(window.location.pathname)) {
      navigate('/login');
    }

    if (userId && window.location.pathname === '/login') {
      navigate('/');
    }

  }, [currentuser, navigate, setcurrentuser]);

  let element = useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path:'/repo-deaits/:id',
      element: <RepoDetail/>
    },
    {
      path: '/create-repo', 
      element: <CreateRepo />,
    },
    {
      path:'/user-profile',
      element: <Profile/>
    },
  ]);

  return (
    <div>
      
      <Navbar />
      {element}
    </div>
  );
};

export default AppRoutes;