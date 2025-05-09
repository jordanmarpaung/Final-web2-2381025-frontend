// frontend/src/services/hotelService.ts
import api from "./api";
import type {
  Hotel,
  CreateHotelDto,
  UpdateHotelDto,
  QueryHotelParams,
} from "../types"; // TYPE ONLY

export const getAllHotels = async (
  params?: QueryHotelParams
): Promise<Hotel[]> => {
  const response = await api.get<Hotel[]>("/hotels", { params: params || {} });
  return response.data;
};

export const getHotelById = async (id: string): Promise<Hotel> => {
  const response = await api.get<Hotel>(`/hotels/${id}`);
  return response.data;
};

// --- Admin Only ---
export const createHotel = async (
  hotelData: CreateHotelDto
): Promise<Hotel> => {
  const response = await api.post<Hotel>("/hotels", hotelData);
  return response.data;
};

export const updateHotel = async (
  id: string,
  hotelData: UpdateHotelDto
): Promise<Hotel> => {
  const response = await api.patch<Hotel>(`/hotels/${id}`, hotelData);
  return response.data;
};

export const deleteHotel = async (id: string): Promise<void> => {
  await api.delete(`/hotels/${id}`);
};
