import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, getMe } from '../services/adminApi';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await getMe();
          setAdmin(res.data.data);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginAdmin({ email, password });
      if (res.data.success) {
        const userData = res.data.data.user;
        const token = res.data.data.token;
        localStorage.setItem('adminToken', token);
        setAdmin(userData);
        toast.success('Login successful');
        return userData; // Return full user data including role
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    setAdmin(null);
    toast.success('Logged out');
    window.location.href = '/';
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
