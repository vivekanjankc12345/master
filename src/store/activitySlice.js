// src/store/activitySlice.js
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "activities",
  initialState: { items: [] },
  reducers: {
    addActivityRealtime: (s, a) => {
      s.items.unshift(a.payload);
    },
  },
});

export const { addActivityRealtime } = slice.actions;
export default slice.reducer;
