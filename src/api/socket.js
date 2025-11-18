// src/api/socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  const URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
  if (!socket) {
    socket = io(URL, { autoConnect: true });
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket() first.");
  return socket;
};

