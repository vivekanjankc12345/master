// src/store/activitySlice.js
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "activities",
  initialState: { items: [] },
  reducers: {
    setActivities: (s, a) => {
      s.items = a.payload;
    },
    addActivityRealtime: (s, a) => {
      s.items = [a.payload, ...s.items].sort(
        (x, y) => new Date(y.createdAt) - new Date(x.createdAt)
      );
    },
  },
});

export const { setActivities, addActivityRealtime } = slice.actions;
export default slice.reducer;
