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
             let data;
             try {
               const r1 = await api.get('/users/profile');
               data = r1.data?.user || r1.data?.data || r1.data;
             } catch (e1) {
               const r2 = await api.get('/profile');
               data = r2.data?.user || r2.data?.data || r2.data;
             }
             setUser(data);
        } catch (error) {
            console.error("Session fetch failed", error);
        }
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    try {
      let data;
      try {
        const r1 = await api.get('/users/profile');
        data = r1.data?.user || r1.data?.data || r1.data;
      } catch (e1) {
        const r2 = await api.get('/profile');
        data = r2.data?.user || r2.data?.data || r2.data;
      }
      setUser(data);
      return data;
    } catch (e) {
      console.error("Refresh user failed", e);
      return null;
    }
  };

  const login = async (email, password) => {
    const endpoints = [
      { method: 'post', url: '/users/signin' },
      { method: 'post', url: '/auth/signin' },
      { method: 'post', url: '/users/login' },
      { method: 'post', url: '/login' }
    ];
    let res, lastError, success = false;
    for (const ep of endpoints) {
      try {
        res = await api[ep.method](ep.url, { email, password });
        success = true;
        break;
      } catch (err) {
        lastError = err;
        if (err.response && err.response.status !== 404) {
          throw err;
        }
      }
    }
    if (!success) {
      const attempted = endpoints.map(e => `${e.method.toUpperCase()} ${e.url}`).join(' , ');
      const error = new Error('فشل تسجيل الدخول. تأكد من البيانات.');
      error.attempted = attempted;
      throw error;
    }
    const data = res.data || {};
    const token = data.token || data.data?.token || data.Token;
    const refreshToken = data.refreshToken || data.data?.refreshToken || data.RefreshToken;
    const userPayload = data.user || data.data?.user || data.data || { email };
    if (!token) {
      throw new Error('لم يتم استلام رمز الدخول من الخادم');
    }
    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    setUser(userPayload);
    router.push('/home'); // Redirect following login to home
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/auth/signin');
  };

  const signup = async (userData) => {
      const endpoints = [
        { method: 'post', url: '/users/signup' },
        { method: 'post', url: '/auth/signup' },
        { method: 'post', url: '/users/register' },
        { method: 'post', url: '/register' },
        { method: 'post', url: '/signup' }
      ];
      let lastError;
      let success = false;
      for (const ep of endpoints) {
        try {
          await api[ep.method](ep.url, userData);
          success = true;
          break;
        } catch (err) {
          lastError = err;
          if (err.response && err.response.status !== 404) {
            throw err;
          }
        }
      }
      if (!success) {
        const attempted = endpoints.map(e => `${e.method.toUpperCase()} ${e.url}`).join(' , ');
        const e = new Error('حدث خطأ أثناء التسجيل.');
        e.attempted = attempted;
        throw e;
      }
      router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
