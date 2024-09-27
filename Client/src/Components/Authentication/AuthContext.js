// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    // Initialize the authentication state from localStorage or other storage mechanism
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const login = (data) => {
    setAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('user',JSON.stringify(data));
    console.log(JSON.parse(sessionStorage.getItem('user')));
  };

  const logout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
  };

  // Use useEffect to check the authentication state on component mount
  useEffect(() => {
    const storedAuthState = sessionStorage.getItem('isAuthenticated');
    if (storedAuthState !== null) {
      setAuthenticated(storedAuthState === 'true');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
