import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    setUser(null); // clear user state 
    navigate("/"); // redirect to login page
  };

  return (
    <header className="bg-indigo-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <span className="text-2xl">🛡️</span>
        <span className="text-xl font-bold tracking-wide">SpamSafe</span>
      </Link>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="font-medium">
              Hi, <span className="font-semibold">{user.username}</span>!
            </span>
            {(user.role === 'admin' || user.role === 'superadmin') && (
              <Link to="/admin/dashboard" className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 rounded-md transition font-medium">
                 Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="font-medium text-gray-200">Login or Register below</span>
        )}
      </div>
    </header>
  );
}
