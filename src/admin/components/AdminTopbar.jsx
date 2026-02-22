import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminTopbar = ({ toggleSidebar }) => {
  const { logout, admin } = useAdminAuth();

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none md:hidden">
          ☰
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Welcome, <span className="font-semibold">{admin?.username || 'Admin'}</span>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
