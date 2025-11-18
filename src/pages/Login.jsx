// src/pages/Login.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { Navigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  if (token) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser(form));
      if (res.meta.requestStatus === "fulfilled") {
        // token stored by slice; socket will init by App effect
      }
    } catch (err) {
      // handled in slice
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in to CRM</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded mt-2 hover:bg-indigo-700"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          Use seeded users from `seeds/seedUsers.js` — e.g. <br />
          <code>admin@crm.test / Admin@123</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
