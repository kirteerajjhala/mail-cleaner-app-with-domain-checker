import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Auth from "./Auth";
import SpamChecker from "./SpamChecker";
import OutgoingHelper from "./OutgoingHelper";
import ContactUs from "./ContactUs";
import ResetPassword from "./ResetPassword";
import AdminRoutes from "./admin/routes/AdminRoutes";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleSetUser = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
    setUser(userData);
  };

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Conditionally show Header and NavBar only for non-admin paths */}
      {!isAdminPath && (
        <>
          <Header user={user} setUser={handleSetUser} />
          <NavBar user={user} />
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${!isAdminPath ? 'container mx-auto px-4 py-6' : ''}`}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Reset Password */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Home / Auth */}
          <Route
            path="/"
            element={
              !user ? (
                <Auth onLogin={handleSetUser} />
              ) : user.role === 'admin' || user.role === 'superadmin' ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/home" />
              )
            }
          />

          <Route
            path="/home"
            element={
              user ? (
                <section className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    Welcome to <span className="text-indigo-600">SpamSafe</span>!
                  </h2>
                  <p className="text-gray-700">
                    Identify spam and phishing emails, check sender domains, and improve your
                    outgoing messages with AI-powered suggestions.
                  </p>
                </section>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Incoming */}
          <Route
            path="/incoming"
            element={user ? <SpamChecker user={user} /> : <Navigate to="/" />}
          />

          {/* Outgoing */}
          <Route
            path="/outgoing"
            element={user ? <OutgoingHelper user={user} /> : <Navigate to="/" />}
          />

          {/* Contact */}
          <Route path="/contact" element={<ContactUs user={user} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer - Only for non-admin paths */}
      {!isAdminPath && (
        <footer className="bg-gray-100 py-4 mt-auto text-center text-gray-600 text-sm">
          SpamSafe is open-source. <a href="#" className="text-indigo-600 underline">Learn how it works!</a>
        </footer>
      )}
    </div>
  );
}

export default App;
