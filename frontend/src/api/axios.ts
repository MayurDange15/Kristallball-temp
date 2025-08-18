import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

const api = axios.create({
  baseURL: process.env.baseURL, // backend base
});

// Interceptor: attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
