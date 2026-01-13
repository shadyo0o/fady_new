'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
             // Validate token or get profile - using /users/profile as per spec
             const { data } = await api.get('/users/profile');
             setUser(data);
        } catch (error) {
            console.error("Session fetch failed", error);
        }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    // Correct endpoint is /users/signin
    const { data } = await api.post('/users/signin', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user || { email });
    router.push('/home'); // Redirect following login to home
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/auth/signin');
  };

  const signup = async (userData) => {
      // Correct endpoint is /users/signup
      await api.post('/users/signup', userData);
      router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
