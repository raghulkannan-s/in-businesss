import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  eligibility: boolean;
  score: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  csrfToken: string;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};