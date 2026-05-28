import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (jwtToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Stale token
        logout();
      }
    } catch (e) {
      console.error('Failed to restore session credentials', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('medverify_token');
    const storedUserStr = localStorage.getItem('medverify_user');

    if (storedToken && storedUserStr) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUserStr));
        // Verify token with server as well
        fetchCurrentUser(storedToken);
      } catch {
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (jwtToken: string, userData: User) => {
    localStorage.setItem('medverify_token', jwtToken);
    localStorage.setItem('medverify_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('medverify_token');
    localStorage.removeItem('medverify_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('medverify_token') || token;
    if (storedToken) {
      await fetchCurrentUser(storedToken);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be styled within an AuthProvider element hierarchy');
  }
  return context;
};
