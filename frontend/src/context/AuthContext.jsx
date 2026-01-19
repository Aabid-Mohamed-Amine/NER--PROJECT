import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // We initialize state directly from localStorage so it's available immediately
  // This prevents the "flicker" of showing Login page before Dashboard
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false); // Start false because we read token above

  // We still keep this to sync any future changes, but it's cleaner now
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken !== token) {
        setToken(storedToken);
    }
  }, []); // <--- CRITICAL: This empty array [] stops the infinite loop!

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};