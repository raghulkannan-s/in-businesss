import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (unauthorized) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Force logout
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      // Redirect to login (you'll need to handle this in your app)
      // This could trigger an event or use navigation
      console.log('Session expired, please login again');
      
      // You might want to redirect to login screen here
      // or broadcast an event that AuthContext can listen to
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (phone, password) => api.post('/api/auth/login', { phone, password }),
  register: (name, email, phone, password) => api.post('/api/auth/register', { name, email, phone, password }),
  verify: () => api.get('/api/auth/verify'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/api/users/me'),
  getScore: () => api.get('/api/users/score'),
  updateScore: (score) => api.post('/api/users/score', { score }),
};

// Player API
export const playerAPI = {
  getAllPlayers: () => api.get('/api/players'),
  getPlayerById: (id) => api.get(`/api/players/${id}`),
  createPlayer: (data) => api.post('/api/players', data),
  updatePlayer: (id, data) => api.put(`/api/players/${id}`, data),
  deletePlayer: (id) => api.delete(`/api/players/${id}`),
  checkEligibility: (playerId) => api.post('/api/players/eligibility', { playerId }),
  getPlayerRankings: () => api.get('/api/players/rankings'),
};

// Match API
export const matchAPI = {
  getAllMatches: (status) => api.get('/api/matches', { params: { status } }),
  getMatchById: (id) => api.get(`/api/matches/${id}`),
  createMatch: (data) => api.post('/api/matches', data),
  updateMatch: (id, data) => api.put(`/api/matches/${id}`, data),
  deleteMatch: (id) => api.delete(`/api/matches/${id}`),
  setToss: (id, data) => api.post(`/api/matches/${id}/toss`, data),
  startMatch: (id) => api.post(`/api/matches/${id}/start`),
  addBallEntry: (id, data) => api.post(`/api/matches/${id}/ball`, data),
  getScoreboard: (id) => api.get(`/api/matches/${id}/scoreboard`),
};