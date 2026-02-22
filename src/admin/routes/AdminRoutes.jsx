import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../context/AdminAuthContext';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import MailManagement from '../pages/MailManagement';
import SpamMonitoring from '../pages/SpamMonitoring';
import ContactManagement from '../pages/ContactManagement';
import ReportsStatistics from '../pages/ReportsStatistics';
import SystemSettings from '../pages/SystemSettings';
import SecurityLogs from '../pages/SecurityLogs';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, admin } = useAdminAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">Loading Admin Panel...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check role for RBAC
  if (admin?.role !== 'admin' && admin?.role !== 'superadmin') {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="mails" element={<MailManagement />} />
          <Route path="spam" element={<SpamMonitoring />} />
          <Route path="contacts" element={<ContactManagement />} />
          <Route path="reports" element={<ReportsStatistics />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="security" element={<SecurityLogs />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminRoutes;
