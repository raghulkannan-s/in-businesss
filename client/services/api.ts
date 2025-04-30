import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

async function getHeaders() {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  auth: {
    login: async (credentials: { phone: string; password: string }) => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: await getHeaders(),
          body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        return data;
      } catch (error) {
        throw error;
      }
    },
    
    register: async (userData: { name: string; email: string; phone: string; password: string }) => {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: await getHeaders(),
          body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        return data;
      } catch (error) {
        throw error;
      }
    },
    
    forgotPassword: async (data: { phone: string }) => {
      try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: await getHeaders(),
          body: JSON.stringify(data),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.message || 'Request failed');
        }
        
        return responseData;
      } catch (error) {
        throw error;
      }
    },
  },
  // Add other API endpoints here as needed
};