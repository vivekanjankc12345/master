// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import leadReducer from "./leadSlice";
import userReducer from "./userSlice";
import activityReducer from "./activitySlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    users: userReducer,
    activities: activityReducer,
    notifications: notificationReducer,
  },
});

export default store;
