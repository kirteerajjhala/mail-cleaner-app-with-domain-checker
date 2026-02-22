import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "./constants";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Forgot password flow
    if (mode === "forgot") {
      if (!email) return setErr("Please enter your email.");
      try {
        const res = await fetch(`${API_BASE_URL}/auth/forgot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) toast.success("Password reset link sent!");
        else setErr(data.message || "Something went wrong.");
      } catch {
        setErr("Server error. Try again later.");
      }
      return;
    }

    // Login/Register validation
    if (!email || !password || (mode === "register" && !username)) {
      setErr("Please fill all required fields.");
      return;
    }

    try {
      const url =
        mode === "login"
          ? `${API_BASE_URL}/auth/login`
          : `${API_BASE_URL}/auth/register`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email, password } : { username, email, password }
        ),
      });

      const data = await res.json();

      if (res.ok) {
        // Set adminToken if the user is an admin
        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
          localStorage.setItem('adminToken', data.token);
        }

        // Set user in App.jsx
        onLogin({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          token: data.token,
        });

        toast.success(mode === "login" ? "Logged in successfully!" : "Account created!");
        
        // Role-based redirection
        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
           navigate("/admin/dashboard");
           window.location.reload(); // Reload to initialize AdminAuthContext correctly
        } else {
           navigate("/home"); // redirect to home
        }
      } else {
        setErr(data.message || "Something went wrong.");
      }
    } catch {
      setErr("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex w-full  flex-col  ">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center p-5 ">
        <div className="flex items-center gap-3">
          {mode !== "login" && (
            <IoArrowBack
              size={22}
              className="cursor-pointer text-gray-600 hover:text-black transition"
              onClick={() => setMode("login")}
            />
          )}
          <h1 className="text-xl font-semibold capitalize">
            {mode === "login"
              ? "Log in"
              : mode === "register"
              ? "Sign up"
              : "Forgot Password"}
          </h1>
        </div>

        {mode !== "forgot" && (
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm font-medium cursor-pointer  text-gray-700 hover:underline transition"
          >
            {mode === "login" ? "Create account" : "Already have account?"}
          </button>
        )}
      </div>

      {/* Form Body */}
      <div className="flex-1 flex items-center justify-center px-4 bg-gray-50  py-12 ">
        <div className="w-full max-w-4xl flex flex-col md:flex-row  bg-white  transform transition-all duration-300 hover:scale-105 shadow-2xl rounded-2xl p-8 md:p-12 gap-10">
          
          {/* Left - Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {mode !== "forgot" && (
                <div className="relative">
                  <label className="text-sm font-medium text-gray-600">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full mt-1 px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              )}

              {err && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2">
                  {err}
                </p>
              )}

              <button
                type="submit"
                className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-full transition"
              >
                {mode === "login"
                  ? "Log in"
                  : mode === "register"
                  ? "Sign up"
                  : "Send reset link"}
              </button>
            </form>

            {mode === "login" && (
              <div className="text-sm text-center mt-3 cursor-pointer">
                <button
                  className="text-indigo-600 underline hover:text-indigo-800 cursor-pointer"
                  onClick={() => setMode("forgot")}
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-200"></div>

          {/* Right - Social Login */}
          <div className="flex-1 flex flex-col gap-3">
            <button className="flex items-center  cursor-pointer justify-center gap-3 bg-white border border-gray-300 rounded-full py-2.5 px-4 font-medium hover:bg-gray-50 transition">
              <FaGoogle className="text-red-500" />
              <span className="text-gray-800">Continue with Google</span>
            </button>

            <button className="flex items-center cursor-pointer justify-center gap-3 bg-white border border-gray-300 rounded-full py-2.5 px-4 font-medium hover:bg-gray-50 transition">
              <FaFacebookF className="text-blue-600" />
              <span className="text-gray-800">Continue with Facebook</span>
            </button>

            <button className="flex items-center cursor-pointer justify-center gap-3 bg-white border border-gray-300 rounded-full py-2.5 px-4 font-medium hover:bg-gray-50 transition">
              <FaEnvelope className="text-gray-700" />
              <span className="text-gray-800">Sign up with Email</span>
            </button>

            <p className="text-xs text-center text-gray-500 mt-6">
              Secure Login with reCAPTCHA subject to{" "}
              <span className="underline cursor-pointer">Google Terms</span> &{" "}
              <span className="underline cursor-pointer">Privacy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


