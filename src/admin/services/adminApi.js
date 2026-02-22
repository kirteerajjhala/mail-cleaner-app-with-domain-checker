import axios from 'axios';
import toast from 'react-hot-toast';
import { ADMIN_API_BASE_URL } from '../../constants';

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      // Redirect handled by AuthContext or Route protection
       if (window.location.pathname !== '/admin/login') {
         window.location.href = '/admin/login';
       }
    }
    return Promise.reject(error);
  }
);

export const loginAdmin = (credentials) => adminApi.post('/auth/login', credentials);
export const getMe = () => adminApi.get('/auth/me');

// Dashboard
export const getDashboardStats = () => adminApi.get('/dashboard/stats');
export const getDashboardCharts = () => adminApi.get('/dashboard/charts');

// Users
export const getUsers = (params) => adminApi.get('/users', { params });
export const getUser = (id) => adminApi.get(`/users/${id}`);
export const blockUser = (id) => adminApi.put(`/users/${id}/block`);
export const unblockUser = (id) => adminApi.put(`/users/${id}/unblock`);
export const updateUserRole = (id, role) => adminApi.put(`/users/${id}/role`, { role });
export const updateAdminNotes = (id, notes) => adminApi.put(`/users/${id}/notes`, { adminNotes: notes });
export const deleteUser = (id) => adminApi.delete(`/users/${id}`);

// Mails
export const getMails = (params) => adminApi.get('/mails', { params });
export const getMail = (id) => adminApi.get(`/mails/${id}`);
export const deleteMail = (id) => adminApi.delete(`/mails/${id}`);
export const deleteBulkMails = (ids) => adminApi.delete('/mails/bulk', { data: { ids } });
export const getMailStats = () => adminApi.get('/mails/stats');

// Spam
export const getSpamLogs = (params) => adminApi.get('/spam', { params });
export const getSpamAnalytics = () => adminApi.get('/spam/analytics');
export const flagSpamLog = (id) => adminApi.put(`/spam/${id}/flag`);
export const clearSpamLog = (id) => adminApi.put(`/spam/${id}/clear`);
export const deleteSpamLog = (id) => adminApi.delete(`/spam/${id}`);

// Contacts
export const getContacts = (params) => adminApi.get('/contacts', { params });
export const getContact = (id) => adminApi.get(`/contacts/${id}`);
export const updateContactStatus = (id, status) => adminApi.put(`/contacts/${id}/status`, { status });
export const assignContact = (id, userId) => adminApi.put(`/contacts/${id}/assign`, { assignedTo: userId });
export const replyContact = (id, reply) => adminApi.put(`/contacts/${id}/reply`, { reply });
export const deleteContact = (id) => adminApi.delete(`/contacts/${id}`);

// Reports
export const getReports = (params) => adminApi.get('/reports', { params });
export const generateReport = (data) => adminApi.post('/reports/generate', data);
export const getReport = (id) => adminApi.get(`/reports/${id}`);
export const deleteReport = (id) => adminApi.delete(`/reports/${id}`);

// Settings
export const getSettings = (category) => adminApi.get('/settings', { params: { category } });
export const updateSetting = (data) => adminApi.put('/settings', data);
export const resetSettings = (category) => adminApi.post('/settings/reset', { category });

// Security
export const getSecurityLogs = (params) => adminApi.get('/security/logs', { params });
export const getSecuritySummary = () => adminApi.get('/security/summary');
export const clearSecurityLogs = (beforeDate) => adminApi.delete('/security/logs/clear', { data: { beforeDate } });

export default adminApi;
