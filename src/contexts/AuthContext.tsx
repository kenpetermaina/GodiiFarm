// contexts/AuthContext.tsx (updated with axios)
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { api } from '../services/api';
import { AuthContextType, AuthState, User, LoginCredentials, RegisterData } from '../types/auth.types';

// Create the context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = api.getAuthToken();
      
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Verify token and get user data
      const user = await fetchUserData();
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      api.clearAuthTokens();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const fetchUserData = async (): Promise<User> => {
    try {
      const response = await api.get<{ user: User }>('/user');
      return response.user;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

    //   const response = await api.post<{ user: User; token: string; refreshToken?: string }>(
      const response = await api.post(
        '/v1/auth/login',
        credentials
      );
      console.log("Res: ", response);
      
      // Store tokens
      api.setAuthToken(response.auth_token, credentials.rememberMe || false);

      localStorage.setItem("authToken", response.auth_token)
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return response;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        error: error.message || 'An error occurred during login',
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

    //   const response = await api.post<{ user: User; token: string; refreshToken?: string }>(
      const response = await api.post(
        '/v1/auth/register',
        data
      );
      console.log("Response: ", response);
      // Store tokens (register typically persists by default)
      api.setAuthToken(response.token, true);
      
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return response;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        error: error.message || 'An error occurred during registration',
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const token = api.getAuthToken();
      
      if (token) {
        // Call logout endpoint
        await api.post('/auth/logout');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      api.clearAuthTokens();
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await api.patch<{ user: User }>('/auth/profile', userData);

      setState(prev => ({
        ...prev,
        user: response.user,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'An error occurred while updating user',
      }));
      throw error;
    }
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Optional: Protected route component
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Please log in to access this page</div>;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div>You don't have permission to access this page</div>;
  }

  return <>{children}</>;
};