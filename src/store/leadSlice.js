// src/store/leadSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchLeads = createAsyncThunk("leads/get", async () => {
  const { data } = await axiosClient.get("/leads");
  return data;
});

export const createLead = createAsyncThunk("leads/create", async (payload) => {
  const { data } = await axiosClient.post("/leads", payload);
  return data;
});

export const updateLead = createAsyncThunk(
  "leads/update",
  async ({ id, payload }) => {
    const { data } = await axiosClient.put(`/leads/${id}`, payload);
    return data;
  }
);

export const deleteLead = createAsyncThunk("leads/delete", async (id) => {
  await axiosClient.delete(`/leads/${id}`);
  return id;
});

const leadSlice = createSlice({
  name: "leads",
  initialState: { items: [], loading: false },
  reducers: {
    addLeadRealtime: (s, a) => {
      const exists = s.items.find((i) => i.id === a.payload.id);
      if (!exists) s.items.unshift(a.payload);
    },
    updateLeadRealtime: (s, a) => {
      const idx = s.items.findIndex((i) => i.id === a.payload.id);
      if (idx !== -1) s.items[idx] = a.payload;
    },
    deleteLeadRealtime: (s, a) => {
      s.items = s.items.filter((i) => i.id !== a.payload);
    },
  },

  extraReducers: (b) => {
    b.addCase(fetchLeads.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchLeads.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(createLead.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(updateLead.fulfilled, (s, a) => {
        const idx = s.items.findIndex((i) => i.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteLead.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i.id !== a.payload);
      });
  },
});

export const { addLeadRealtime, updateLeadRealtime, deleteLeadRealtime } =
  leadSlice.actions;

export default leadSlice.reducer;
