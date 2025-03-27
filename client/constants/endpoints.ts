export const API_BASE_URL = 'http://192.168.1.100:3000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  },
  VENUES: {
    LIST: `${API_BASE_URL}/venues`,
    DETAILS: (id: string) => `${API_BASE_URL}/venues/${id}`,
  },
  MATCHES: {
    LIST: `${API_BASE_URL}/matches`,
    DETAILS: (id: string) => `${API_BASE_URL}/matches/${id}`,
    CREATE: `${API_BASE_URL}/matches`,
  },
  RANKINGS: {
    BATSMAN: `${API_BASE_URL}/rankings/batsman`,
    BOWLER: `${API_BASE_URL}/rankings/bowler`,
  },
};