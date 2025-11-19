// src/pages/Login.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Mail, Lock, ShieldCheck, Users, Activity } from "lucide-react";
import { loginUser } from "../store/authSlice";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
});

const Login = () => {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white p-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck size={34} />
              <div>
                <p className="text-sm uppercase tracking-widest text-white/80">
                  UnionMaster CRM
                </p>
                <p className="text-xl font-semibold">Real-time Growth Hub</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-white/90">
              Stay on top of every lead, activity, and notification with instant socket
              updates, automated emails, and executive dashboards.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-white/90">
            <div>
              <p className="text-3xl font-bold flex items-center gap-2">
                <Users size={24} />
                120+
              </p>
              <p className="text-sm uppercase tracking-wider">Active Reps</p>
            </div>
            <div>
              <p className="text-3xl font-bold flex items-center gap-2">
                <Activity size={24} />
                98%
              </p>
              <p className="text-sm uppercase tracking-wider">Response SLA</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600 uppercase">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold mt-2">Sign in to your workspace</h1>
            <p className="text-gray-500 mt-2">
              Use the seeded credentials from <code>seeds/seedUsers.js</code>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="mt-1 flex items-center gap-2 border px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  className="w-full outline-none"
                  placeholder="admin@crm.test"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Password</label>
              <div className="mt-1 flex items-center gap-2 border px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
                <Lock size={18} className="text-gray-400" />
                <input
                  type="password"
                  className="w-full outline-none"
                  placeholder="Admin@123"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

