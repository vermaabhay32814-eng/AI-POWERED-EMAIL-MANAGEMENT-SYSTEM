import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, gmailAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [gmailStatus, setGmailStatus] = useState({
    isConnected: true,
    email: 'abhay.verma.dev@gmail.com',
    isDemoAccount: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token) {
          const res = await authAPI.getMe();
          if (res.data?.success) {
            setUser(res.data.data);
          }
        } else {
          // Preload default demo user profile for immediate out-of-the-box readiness
          setUser({
            _id: 'user_demo_123',
            name: 'Abhay Verma',
            email: 'abhay.verma.dev@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          });
        }
      } catch (err) {
        console.warn('Auth init check:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchGmailStatus = async () => {
      try {
        const res = await gmailAPI.getStatus();
        if (res.data?.success) {
          setGmailStatus(res.data.data);
        }
      } catch (err) {
        console.warn('Gmail status check:', err);
      }
    };

    initAuth();
    fetchGmailStatus();
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        const { token: newToken, ...userData } = res.data.data;
        if (newToken) {
          localStorage.setItem('token', newToken);
          setToken(newToken);
        }
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register({ name, email, password });
      if (res.data?.success) {
        const { token: newToken, ...userData } = res.data.data;
        if (newToken) {
          localStorage.setItem('token', newToken);
          setToken(newToken);
        }
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const toggleSimulatedGmail = async (connected) => {
    try {
      const res = await gmailAPI.simulateConnect(connected);
      if (res.data?.success) {
        setGmailStatus(prev => ({
          ...prev,
          isConnected: connected,
        }));
      }
    } catch (err) {
      console.error('Failed to toggle simulated Gmail:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        gmailStatus,
        login,
        register,
        logout,
        toggleSimulatedGmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
