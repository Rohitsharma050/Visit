import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Try to get cached user from localStorage for instant load
  const cachedUser = (() => {
    try {
      const cached = localStorage.getItem('cachedUser');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  })();

  const [user, setUser] = useState(cachedUser);
  const [loading, setLoading] = useState(!!localStorage.getItem('token') && !cachedUser);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // If we have cached user, don't block - validate in background
      if (cachedUser) {
        setLoading(false);
        // Validate token in background
        api.get('/auth/me')
          .then(response => {
            const userData = response.data.data.user;
            setUser(userData);
            localStorage.setItem('cachedUser', JSON.stringify(userData));
          })
          .catch(() => {
            // Token invalid, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('cachedUser');
            setUser(null);
          });
        return;
      }

      // No cached user, need to fetch (with timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await api.get('/auth/me', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem('cachedUser', JSON.stringify(userData));
      } catch (error) {
        // Token is invalid or timeout, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('cachedUser');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('cachedUser', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('cachedUser', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const response = await api.post('/auth/google', {
        googleId: googleData.userInfo.googleId,
        email: googleData.userInfo.email,
        name: googleData.userInfo.name,
        profilePicture: googleData.userInfo.profilePicture,
        accessToken: googleData.accessToken
      });
      
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('cachedUser', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Google login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cachedUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    googleLogin,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

