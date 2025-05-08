import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Set default auth header for all axios requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Get user info from token
          const response = await axios.get(`${API_URL}/api/auth/verify`);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to load token or verify:', error);
        // Clear invalid token
        await AsyncStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  // Register a new user
  const register = async (name, email, phone, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        phone,
        password
      });
      
      const { token } = response.data;
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);
      
      // Set default auth header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(response.data);
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login an existing user
  const login = async (phone, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        phone,
        password
      });
      
      const { token } = response.data;
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);
      
      // Set default auth header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(response.data);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Check if user is manager or admin
  const isManager = () => {
    return user && (user.role === 'manager' || user.role === 'admin');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        register, 
        login, 
        logout,
        isAdmin,
        isManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
