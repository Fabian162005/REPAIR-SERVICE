import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Manda el token en cada petición
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Si el token ya no sirve, vuelve al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes("/login");

    if (error.response?.status === 401 && !esLogin) {
      useAuthStore.getState().logout();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;