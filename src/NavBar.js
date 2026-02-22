import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar({ user }) {
  if (!user) return null; // user नहीं है तो navbar दिखाओ मत

  const linkClasses = (isActive) =>
    `px-4 py-2 rounded-md font-medium transition ${
      isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
      <NavLink to="/home" className={({ isActive }) => linkClasses(isActive)}>
        Home
      </NavLink>

      <NavLink to="/incoming" className={({ isActive }) => linkClasses(isActive)}>
        Incoming Checker
      </NavLink>

      <NavLink to="/outgoing" className={({ isActive }) => linkClasses(isActive)}>
        Outgoing Helper
      </NavLink>

      <NavLink to="/contact" className={({ isActive }) => linkClasses(isActive)}>
        Contact Us
      </NavLink>
    </nav>
  );
}
