// src/store/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get("/notifications");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const markAllReadAPI = createAsyncThunk("notifications/markAll", async (_, { rejectWithValue }) => {
  try {
    await axiosClient.put("/notifications/mark-all-read");
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const slice = createSlice({
  name: "notifications",
  initialState: { items: [], unread: 0, loading: false },
  reducers: {
    addNotification: (s, a) => {
      s.items.unshift(a.payload);
      s.unread = s.items.filter(n => !n.isRead).length;
    },
    markReadLocal: (s, a) => {
      s.items = s.items.map(n => ({ ...n, isRead: true }));
      s.unread = 0;
    }
  },
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending, (s) => { s.loading = true; })
     .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
        s.unread = a.payload.filter(n => !n.isRead).length;
     })
     .addCase(fetchNotifications.rejected, (s) => { s.loading = false; });
    b.addCase(markAllReadAPI.fulfilled, (s) => {
      s.items = s.items.map(n => ({ ...n, isRead: true }));
      s.unread = 0;
    });
  }
});

export const { addNotification, markReadLocal } = slice.actions;
export default slice.reducer;
