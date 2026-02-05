import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORT YOUR API SERVICE (Adjust path if needed)
import { api } from '@/services/api'; 

interface User {
  userId: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ requiresPattern: boolean; tempToken?: string }>;
  verifyPattern: (tempToken: string, pattern: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token with backend
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      // 👇 REPLACED: Uses api.get() - Auto-adds URL and Token
      const userData = await api.get<User>('/auth/profile');
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Token invalid, clear it
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // 👇 REPLACED: Uses api.post() - Auto-adds URL
    // api.post handles error throwing automatically
    const data = await api.post<{ requiresPattern: boolean; tempToken?: string }>('/auth/login', { 
      email, 
      password 
    });
    
    return data;
  };

  const verifyPattern = async (tempToken: string, pattern: string) => {
    // 👇 REPLACED: Uses api.post()
    const data = await api.post<{ accessToken: string }>('/auth/verify-pattern', { 
      tempToken, 
      pattern 
    });

    // Store token and fetch user profile
    localStorage.setItem('accessToken', data.accessToken);
    await fetchUserProfile();
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/dashboard/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        verifyPattern,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};