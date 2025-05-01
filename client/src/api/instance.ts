import { getUser } from "@/utils/user.utils";
import axios from "axios";

const apiUrl = "http://localhost:3001/api";

export const instance = axios.create({
  baseURL: apiUrl,
});

export const protectedInstance = axios.create({
  baseURL: apiUrl,
});

protectedInstance.interceptors.request.use((config) => {
  const user = getUser();
  if (user) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});
