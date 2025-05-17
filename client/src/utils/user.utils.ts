import { TRespAuth } from "@/api/auth.api";

export const USER_LS_KEY = "user";

export const getUser = () => {
  const user = localStorage.getItem(USER_LS_KEY);
  if (!user) return null;

  return JSON.parse(user) as TRespAuth;
};

export const setUser = (user: TRespAuth) => {
  localStorage.setItem(USER_LS_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(USER_LS_KEY);
};
