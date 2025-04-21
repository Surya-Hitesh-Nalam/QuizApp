/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';

const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) throw new Error('No token found');
    
        const res = await fetch('http://localhost:3000/api/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
    
        if (res) {
          const userData = await res.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Not logged in or failed to fetch current user', err);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token'); 
      }
    };
    

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const userData = await res.json();
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      throw new Error(err.message || 'Login error');
    }
  };
  
  const register = async (
    username: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      const userData = await res.json();
  
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
  
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: any) {
      throw new Error(err.message || 'Registration error');
    }
  };
  
  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Logout failed (server error)', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
