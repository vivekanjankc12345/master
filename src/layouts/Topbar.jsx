import React from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import NotificationBell from "../components/NotificationBell";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 ml-64">
      <h1 className="text-xl font-semibold text-gray-700">Welcome Back 👋</h1>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="bg-indigo-600 text-white px-3 py-1 rounded-md">
          {user?.role?.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
