import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(null); 

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      token,
      setToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}