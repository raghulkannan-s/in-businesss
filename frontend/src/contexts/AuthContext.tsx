import React, { createContext, useState, useEffect } from 'react';

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
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  csrfToken: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL +'/api/csrf-token', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (phone: string, password: string) => {
    const res = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ phone, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    await fetchMe();
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const res = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (!res.ok) throw new Error("Register failed");
    await fetchMe(); // Refresh user
  };

  const logout = async () => {
    await fetch(import.meta.env.VITE_API_URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        csrfToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export default AuthProvider;
