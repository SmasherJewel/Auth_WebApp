import useAuth from "@/auth/store";
import axios, { type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuth.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  const response = await apiClient.post("/auth/refresh");
  const token = response.data?.accessToken as string | undefined;
  const user = response.data?.user;
  if (!token || !user) {
    throw new Error("Refresh response did not include a session");
  }
  useAuth.getState().setSession(token, user);
  return token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const original = error.config;
    const isRefreshCall = original?.url?.includes("/auth/refresh");

    if (status !== 401 || original?._retry || isRefreshCall) {
      const message = error.response?.data?.message || "Request failed";
      if (!isRefreshCall) {
        toast.error(message);
      }
      return Promise.reject(error);
    }

    original._retry = true;
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    try {
      const newToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      useAuth.getState().clearSession();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
