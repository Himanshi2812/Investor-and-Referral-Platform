import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexachain_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nexachain_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data.user);
          localStorage.setItem('nexachain_user', JSON.stringify(res.data.data.user));
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('nexachain_token', newToken);
    localStorage.setItem('nexachain_user', JSON.stringify(userData));
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const { token: newToken, user: userData } = res.data.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('nexachain_token', newToken);
    localStorage.setItem('nexachain_user', JSON.stringify(userData));
    return res.data;
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data.user);
      localStorage.setItem('nexachain_user', JSON.stringify(res.data.data.user));
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexachain_token');
    localStorage.removeItem('nexachain_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
