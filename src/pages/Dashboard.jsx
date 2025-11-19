// src/pages/Dashboard.jsx
import React, { useEffect, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import { useSelector, useDispatch } from "react-redux";
import { fetchLeads } from "../store/leadSlice";
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

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
  const lostCount = leads.filter((l) => l.status === "lost").length;
  const winRate = Math.round((convertedCount / (totalLeads || 1)) * 100);

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

  const pipelineData = useMemo(() => {
    const order = ["pending", "verified", "follow_up", "converted", "lost", "rejected"];
    const map = order.map((status) => ({
      status: status.replace("_", " "),
      value: leads.filter((lead) => lead.status === status).length,
    }));
    return map;
  }, [leads]);

  const conversionTrend = useMemo(() => {
    const bucket = {};
    leads.forEach((lead) => {
      const month = new Date(lead.createdAt).toLocaleString("default", { month: "short" });
      if (!bucket[month]) bucket[month] = { month, total: 0, converted: 0 };
      bucket[month].total += 1;
      if (lead.status === "converted") bucket[month].converted += 1;
    });
    return Object.values(bucket);
  }, [leads]);

  // Recent activities (from socket)
  const recentActivities = useMemo(() => {
    return activities.slice(0, 5);
  }, [activities]);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Intelligence Dashboard</h1>
        <p className="text-gray-500">
          Track funnel health, conversion velocity, and pipeline risk in real time.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Leads",
            value: totalLeads,
            icon: <Users size={26} />,
            accent: "bg-indigo-600",
          },
          {
            title: "Converted",
            value: convertedCount,
            icon: <CheckCircle size={26} />,
            accent: "bg-teal-500",
          },
          {
            title: "Pending",
            value: pendingCount,
            icon: <ClipboardList size={26} />,
            accent: "bg-amber-500",
          },
          {
            title: "Win Rate",
            value: `${winRate}%`,
            icon: <TrendingUp size={26} />,
            accent: "bg-rose-500",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex items-center gap-4"
          >
            <div className={`${card.accent} text-white p-3 rounded-lg`}>{card.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Leads Growth</h2>
              <p className="text-xs text-gray-500">Monthly inflow trend</p>
            </div>
            <span className="text-sm font-semibold text-indigo-600">
              {monthlyData.length} data points
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
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
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Conversion Insight */}
        <div className="bg-white rounded-xl shadow p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Conversion Velocity</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={conversionTrend}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="converted"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorConverted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Bar */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pipeline Health</h2>
            <div className="flex items-center gap-2 text-sm text-amber-500">
              <AlertTriangle size={16} />
              <span>{lostCount} lost</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={pipelineData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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

        {/* Status Legend */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Stage Snapshot</h2>
          <div className="grid grid-cols-2 gap-4">
            {pipelineData.map((stage) => (
              <div
                key={stage.status}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <p className="text-sm text-gray-500 capitalize">{stage.status}</p>
                <p className="text-2xl font-bold">{stage.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
