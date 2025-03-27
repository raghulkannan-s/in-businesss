import { useState, useEffect, createContext, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

import { loginUser, registerUser } from '@/services/authService';

// Types
type User = {
  id: string;
  name: string;
  email?: string;
  phone: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        const storedUser = await SecureStore.getItemAsync('userData');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredUser();
  }, []);

  // Login function
  const login = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In development, you might want to use the mock data instead
      // of making actual API calls while setting up the server
      const USE_MOCK = true; // Set to false to use the real API
      
      if (USE_MOCK) {
        // Mock successful response for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: '123456',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: phone,
        };
        
        const mockToken = 'mock_token_12345';
        
        // Store auth data
        await SecureStore.setItemAsync('userToken', mockToken);
        await SecureStore.setItemAsync('userData', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setToken(mockToken);
      } else {
        // Real API call
        const response = await loginUser(phone, password);
        
        const userData = {
          id: response._id,
          name: response.name,
          phone: response.phone
        };
        
        // Store auth data
        await SecureStore.setItemAsync('userToken', response.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        
        setUser(userData);
        setToken(response.token);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Similar to login, use mock during development if needed
      const USE_MOCK = true; // Set to false to use the real API
      
      if (USE_MOCK) {
        // Mock successful response for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockUser = {
          id: '123456',
          name: name,
          email: email,
          phone: phone,
        };
        
        const mockToken = 'mock_token_12345';
        
        // Store auth data
        await SecureStore.setItemAsync('userToken', mockToken);
        await SecureStore.setItemAsync('userData', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setToken(mockToken);
      } else {
        // Real API call
        const response = await registerUser(name, email, phone, password);
        
        const userData = {
          id: response._id,
          name: response.name,
          email: response.email,
          phone: response.phone
        };
        
        // Store auth data
        await SecureStore.setItemAsync('userToken', response.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        
        setUser(userData);
        setToken(response.token);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear stored data
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      
      // Clear state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}