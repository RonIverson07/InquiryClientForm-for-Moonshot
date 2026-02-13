import React, { useState } from "react";

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      onLogin();
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full border-t-[6px] border-[#0ea5e9]">

        <div className="text-center mb-8">
          <div className="bg-[#0ea5e9] text-white w-20 h-20 rounded-2xl font-black text-4xl flex items-center justify-center mx-auto mb-4">
            SL
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase">
            Admin Login
          </h2>
          <p className="text-slate-400 text-sm">
            Access StartupLab Management Console
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-6"
        >

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@startuplab.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            />
          </div>

          {/* PASSWORD */}
{/* PASSWORD */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Password
  </label>

  <div className="relative w-full">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-3 pr-14 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
    />

    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-slate-500 hover:text-[#0ea5e9] transition"
      >
        {showPassword ? "🙈" : "👁"}
      </button>
    </div>
  </div>
</div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0ea5e9] text-white font-bold rounded-xl hover:bg-sky-600 transition"
          >
            Sign In
          </button>

          {/* BACK */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onBack}
              className="text-slate-400 hover:text-[#0ea5e9] text-xs font-bold uppercase tracking-wider"
            >
              Back to intake form
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
