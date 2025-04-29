import { getToken } from "@/utils/token.utils";
import axios from "axios";

const apiUrl = "http://localhost:3001/api";

export const instance = axios.create({
  baseURL: apiUrl,
});

export const protectedInstance = axios.create({
  baseURL: apiUrl,
});

protectedInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
