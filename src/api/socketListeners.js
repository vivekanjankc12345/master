// src/api/socketListeners.js
import { getSocket } from "./socket";
import store from "../store/store";
import {
  addLeadRealtime,
  updateLeadRealtime,
  deleteLeadRealtime,
} from "../store/leadSlice";
import { addActivityRealtime } from "../store/activitySlice";

/**
 * Call this once after socket is initialized.
 * It will attach listeners and dispatch actions to the store.
 */
let listenersAttached = false;

export const setupSocketListeners = () => {
  if (listenersAttached) return; // only attach once
  listenersAttached = true;

  const socket = getSocket();

 
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

  console.log("Socket listeners attached");
};
