import apiClient from "@/config/apiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type RegisterData from "@/models/RegisterData";
import type User from "@/models/User";

export const registerUser = async (signupData: RegisterData) => {
  const response = await apiClient.post<User>("/auth/register", signupData);
  return response.data;
};

export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>("/auth/login", loginData);
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post<LoginResponseData>("/auth/refresh");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

export const updateCurrentUser = async (data: { name: string }) => {
  const response = await apiClient.patch<User>("/auth/me", data);
  return response.data;
};

export const logoutUser = async () => {
  await apiClient.post("/auth/logout");
};
