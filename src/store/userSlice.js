// src/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchUsers = createAsyncThunk("users/get", async () => {
  const { data } = await axiosClient.get("/users");
  return data;
});

export const createUser = createAsyncThunk("users/create", async (payload) => {
  const { data } = await axiosClient.post("/users", payload);
  return data;
});

export const deleteUser = createAsyncThunk("users/delete", async (id) => {
  await axiosClient.delete(`/users/${id}`);
  return id;
});

const slice = createSlice({
  name: "users",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => { s.loading = true; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(createUser.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(deleteUser.fulfilled, (s, a) => { s.items = s.items.filter((u) => u.id !== a.payload); });
  },
});

export default slice.reducer;
