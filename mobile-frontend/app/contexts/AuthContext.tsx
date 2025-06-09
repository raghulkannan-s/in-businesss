// app/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (phone: string, password: string) => {
    const res = await api.post('/auth/login', { phone, password });
    alert(`Login response: ${JSON.stringify(res)}`);
    await SecureStore.setItemAsync('accessToken', res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    setUser(null);
  };

  const checkUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      }
    } catch (err) {
      console.log('User not logged in');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
