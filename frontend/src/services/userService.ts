// frontend/src/services/userService.ts
import api from "./api";
import type { UserResponseDto, UpdateUserDto } from "../types"; // TYPE ONLY

// --- Admin Operations ---
export const getAllUsers = async (): Promise<UserResponseDto[]> => {
  const response = await api.get<UserResponseDto[]>("/users");
  return response.data;
};

export const getUserById = async (id: string): Promise<UserResponseDto> => {
  const response = await api.get<UserResponseDto>(`/users/${id}`);
  return response.data;
};

export const updateUserByAdmin = async (
  id: string,
  userData: UpdateUserDto
): Promise<UserResponseDto> => {
  const response = await api.patch<UserResponseDto>(`/users/${id}`, userData);
  return response.data;
};

export const deleteUserByAdmin = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/users/${id}`);
  return response.data || { message: "User deleted successfully" };
};

// --- User Operations ---
export const getMyProfile = async (): Promise<UserResponseDto> => {
  const response = await api.get<UserResponseDto>("/users/me");
  return response.data;
};
