// src/api/socketListeners.js
import { getSocket } from "./socket";
import store from "../store/store";
import {
  addLeadRealtime,
  updateLeadRealtime,
  deleteLeadRealtime,
} from "../store/leadSlice";
import { addActivityRealtime } from "../store/activitySlice";
import { addNotification } from "../store/notificationSlice";

/**
 * Call this once after socket is initialized.
 * It will attach listeners and dispatch actions to the store.
 */
let listenersAttached = false;

export const setupSocketListeners = () => {
  if (listenersAttached) return; // only attach once
  listenersAttached = true;

  const socket = getSocket();

  socket.on("lead_created", (payload) => {
    const lead = payload?.lead ?? payload;
    if (lead) store.dispatch(addLeadRealtime(lead));
  });
  socket.on("lead_updated", (payload) =>
    store.dispatch(updateLeadRealtime(payload?.lead || payload))
  );
  socket.on("lead_deleted", (payload) => {
    const id = payload?.id ?? payload;
    if (id) store.dispatch(deleteLeadRealtime(id));
  });
  socket.on("activity_added", (payload) =>
    store.dispatch(addActivityRealtime(payload?.activity || payload))
  );
  socket.on("notification_created", (payload) => {
    const notification = payload?.notification || payload;
    if (notification) {
      store.dispatch(addNotification(notification));
    }
  });

  console.log("Socket listeners attached");
};
