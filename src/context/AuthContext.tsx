import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/api';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nestandkey_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      adminApi
        .getMe()
        .then((res) => {
          if (res.user.role === 'ADMIN') {
            setUser(res.user);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await adminApi.login(email, password);
    if (res.user.role !== 'ADMIN') {
      throw new Error('Access denied. Administrator clearance required.');
    }
    localStorage.setItem('nestandkey_admin_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('nestandkey_admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
