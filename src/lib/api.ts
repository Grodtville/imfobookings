import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://imfobookings-backend.vercel.app";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Get token from localStorage
      const token = localStorage.getItem("imfo_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Handle Content-Type based on data type
    if (config.data instanceof FormData) {
      // Delete Content-Type to let browser set it with boundary
      delete config.headers["Content-Type"];
    } else if (config.data) {
      config.headers["Content-Type"] = "application/json";
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 401 and haven't already retried, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("imfo_token");
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
