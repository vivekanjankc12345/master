// src/pages/Dashboard.jsx
import React, { useEffect, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import { useSelector, useDispatch } from "react-redux";
import { fetchLeads } from "../store/leadSlice";
import { addActivityRealtime } from "../store/activitySlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, ClipboardList, CheckCircle } from "lucide-react";

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#ef4444"];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: leads } = useSelector((s) => s.leads);
  const { items: activities } = useSelector((s) => s.activities);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  // -------- KPI Data ----------
  const totalLeads = leads.length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;
  const pendingCount = leads.filter((l) => l.status === "pending").length;

  // Chart data: Count leads by month
  const monthlyData = useMemo(() => {
    const map = {};
    leads.forEach((lead) => {
      const month = new Date(lead.createdAt).toLocaleString("default", {
        month: "short",
      });
      map[month] = (map[month] || 0) + 1;
    });

    return Object.entries(map).map(([month, value]) => ({ month, value }));
  }, [leads]);

  // Pie data: status distribution
  const pieData = useMemo(() => {
    const map = {};
    leads.forEach((lead) => {
      map[lead.status] = (map[lead.status] || 0) + 1;
    });

    return Object.entries(map).map(([status, value]) => ({
      name: status,
      value,
    }));
  }, [leads]);

  // Recent activities (from socket)
  const recentActivities = useMemo(() => {
    return activities.slice(0, 5);
  }, [activities]);

  return (
    <MainLayout>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Leads */}
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 text-white p-3 rounded-lg">
              <Users size={26} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Leads</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
          </div>
        </div>

        {/* Converted Leads */}
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500 text-white p-3 rounded-lg">
              <CheckCircle size={26} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Converted</p>
              <p className="text-2xl font-bold">{convertedCount}</p>
            </div>
          </div>
        </div>

        {/* Pending Leads */}
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 text-white p-3 rounded-lg">
              <ClipboardList size={26} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="bg-rose-500 text-white p-3 rounded-lg">
              <TrendingUp size={26} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Growth %</p>
              <p className="text-2xl font-bold">
                {Math.floor((convertedCount / (totalLeads || 1)) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Leads Growth (Monthly)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Lead Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>

        {recentActivities.length === 0 && (
          <p className="text-gray-500 text-sm">No activities yet.</p>
        )}

        <div className="space-y-4">
          {recentActivities.map((a) => (
            <div
              key={a.id}
              className="border-l-4 border-indigo-600 pl-4 py-2 bg-gray-50 rounded"
            >
              <p className="text-sm font-medium">{a.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
