// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

const userLS = JSON.parse(localStorage.getItem("crm_user") || "null");
const tokenLS = localStorage.getItem("crm_token");

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post("/auth/login", payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userLS,
    token: tokenLS,
    loading: false,
    error: null,
  },

  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("crm_user");
      localStorage.removeItem("crm_token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        localStorage.setItem("crm_user", JSON.stringify(a.payload.user));
        localStorage.setItem("crm_token", a.payload.token);
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
