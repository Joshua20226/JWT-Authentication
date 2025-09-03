// Manage global state, such as making users' information available to all components
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  registerMessage: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('')
  const [registerMessage, setRegisterMessage] = useState('')
  const router = useRouter();

  // Check token and fetch user data on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/auth/check_token', {
        withCredentials: true
      });
      if (response.status == 200) {
            setUser(response.data.user);
        };
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setRegisterMessage('');
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      })
      
      if (response.status != 200) {
        throw new Error('Login error')
      }

      setUser(response.data.user)
      setErrorMessage('');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data.error || error.message
      setErrorMessage(errorMessage)
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email, 
        password
      });

      if (response.status != 200) {
        throw new Error(response.data?.error)
      }

      setErrorMessage('');
      setRegisterMessage(response.data.message);
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = error.response.data.error || error.message
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      router.push('/');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    isLoading,
    errorMessage, 
    setErrorMessage,
    registerMessage
  };

  console.log('AuthProvider render:', { user, isLoading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 