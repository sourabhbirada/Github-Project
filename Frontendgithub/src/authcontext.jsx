import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); 
};

export const AuthProvider = ({ children }) => {
  const [currentuser, setcurrentuser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setcurrentuser(userId);
    }
  }, []);

  const value = { currentuser, setcurrentuser }; 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
