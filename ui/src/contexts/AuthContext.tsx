import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

type UserType = 'customer' | 'doctor';

interface UserInfo {
  id: number;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType | null;
  userInfo: UserInfo | null;
  login: (token: string, type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedUserType = sessionStorage.getItem('userType') as UserType;
    const savedUserInfo = sessionStorage.getItem('userInfo');
    if (token && savedUserType) {
      setIsAuthenticated(true);
      setUserType(savedUserType);
      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo));
      }
    }
  }, []);

  const login = async (token: string, type: UserType) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userType', type);
    setIsAuthenticated(true);
    setUserType(type);

    try {
      // Get user info based on type
      const meData = type === 'customer' 
        ? await authApi.getCustomerMe()
        : await authApi.getDoctorMe();
      
      const userInfo = {
        id: meData.id,
        username: meData.username
      };
      
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      setUserInfo(userInfo);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUserType(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 