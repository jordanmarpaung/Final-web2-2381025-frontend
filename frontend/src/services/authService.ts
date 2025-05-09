// frontend/src/services/authService.ts
import api from "./api";
import type { AuthResponse, LoginDto, RegisterDto, User } from "../types"; // TYPE ONLY

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const register = async (userData: RegisterDto): Promise<User> => {
  const response = await api.post<User>("/auth/register", userData);
  return response.data;
};

export const getProfile = async (): Promise<User & { userId: string }> => {
  const response = await api.get<User & { userId: string }>("/auth/profile");
  return response.data;
};
