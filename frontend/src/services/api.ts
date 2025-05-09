// frontend/src/services/api.ts
import axios from "axios";
import type { AxiosError } from "axios"; // TYPE ONLY
import type { ApiErrorDetail } from "../types"; // TYPE ONLY

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorDetail>) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        !error.config?.url?.includes("/auth/login")
      ) {
        console.warn("Unauthorized access or token expired. Logging out.");
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
