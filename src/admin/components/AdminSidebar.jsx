import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { admin } = useAdminAuth();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Mails', path: '/admin/mails', icon: '✉️' },
    { name: 'Spam', path: '/admin/spam', icon: '🚫' },
    { name: 'Contacts', path: '/admin/contacts', icon: '📞' },
    { name: 'Reports', path: '/admin/reports', icon: '📈' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
    { name: 'Security', path: '/admin/security', icon: '🛡️' },
  ];

  return (
    <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
      <div className="flex items-center justify-between px-4">
        <span className="text-2xl font-extrabold">AdminPanel</span>
        <button onClick={() => setIsOpen(false)} className="md:hidden">
          ✕
        </button>
      </div>

      <nav>
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${
              location.pathname.startsWith(link.path) ? 'bg-gray-700 text-white' : 'text-gray-400'
            }`}
          >
            <span className="mr-3">{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">Logged in as:</div>
        <div className="font-semibold truncate">{admin?.email}</div>
        <div className="text-xs text-gray-500 uppercase mt-1">{admin?.role}</div>
      </div>
    </div>
  );
};

export default AdminSidebar;
