import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // backend base
});

// attach token automatically
api.interceptors.request.use((config) => {
  const authDataString = localStorage.getItem("auth");

  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString);
      const token = authData?.token; // Safely access the token property

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Could not parse auth token from localStorage", e);
    }
  }

  return config;
});

export default api;
