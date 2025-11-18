// src/hooks/useAuth.js
import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, token } = useSelector((s) => s.auth);
  return { user, token, isLoggedIn: !!token };
};
