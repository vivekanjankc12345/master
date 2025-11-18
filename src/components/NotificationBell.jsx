// src/components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications, markAllReadAPI } from "../store/notificationSlice";
import axiosClient from "../api/axiosClient";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unread, loading } = useSelector(s => s.notifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const toggleOpen = async () => {
    setOpen(v => !v);
    if (!open && unread > 0) {
      // mark all as read on server
      await dispatch(markAllReadAPI());
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleOpen} className="p-2 rounded hover:bg-gray-100">
        <Bell size={22} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded-lg overflow-auto z-50 max-h-96">
          <div className="p-3 border-b">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Notifications</h4>
              <button className="text-sm text-indigo-600" onClick={() => dispatch(markAllReadAPI())}>
                Mark all read
              </button>
            </div>
          </div>

          {loading && <div className="p-3">Loading...</div>}

          <div className="p-3 space-y-2">
            {items.length === 0 && <div className="text-gray-500 text-sm">No notifications</div>}
            {items.map((n) => (
              <div key={n.id} className={`p-3 rounded-md ${n.isRead ? "bg-gray-50" : "bg-indigo-50"}`}>
                <div className="text-sm">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
