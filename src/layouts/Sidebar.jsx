import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardList, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const menu = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/" },
    { label: "Leads", icon: <ClipboardList size={20} />, to: "/leads" },
    { label: "Users", icon: <Users size={20} />, to: "/users" },
  ];

  return (
    <div className="w-64 h-screen bg-navy text-gray-200 fixed top-0 left-0 flex flex-col shadow-xl">
      <div className="px-6 py-4 text-xl font-semibold border-b border-gray-700">
        CRM Panel
      </div>

      <nav className="flex-1 px-4 pt-4 space-y-2">
        {menu.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700/50 text-gray-300"
              }`
            }
          >
            {m.icon}
            {m.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-4">
        <button
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg bg-red-600 hover:bg-red-700 text-white"
          onClick={() => dispatch(logout())}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
