// frontend/src/services/bookingService.ts
import api from "./api";
import type {
  Booking,
  CreateBookingDto,
  QueryBookingParams,
  UpdateBookingStatusDto,
} from "../types"; // TYPE ONLY
import { BookingStatus } from "../types"; // Enum OK

// --- User Operations ---
export const createBooking = async (
  bookingData: CreateBookingDto
): Promise<Booking> => {
  const response = await api.post<Booking>("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async (
  status?: BookingStatus
): Promise<Booking[]> => {
  const params: { status?: BookingStatus } = {};
  if (status) {
    params.status = status;
  }
  const response = await api.get<Booking[]>("/bookings/my-bookings", {
    params,
  });
  return response.data;
};

export const getBookingByIdForUser = async (id: string): Promise<Booking> => {
  const response = await api.get<Booking>(`/bookings/${id}`);
  return response.data;
};

export const cancelMyBooking = async (id: string): Promise<Booking> => {
  const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
  return response.data;
};

// --- Admin Operations ---
export const getAllBookingsAdmin = async (
  params?: QueryBookingParams
): Promise<Booking[]> => {
  const response = await api.get<Booking[]>("/bookings/all", {
    params: params || {},
  });
  return response.data;
};

export const getBookingByIdAdmin = async (id: string): Promise<Booking> => {
  const response = await api.get<Booking>(`/bookings/${id}`);
  return response.data;
};

export const updateBookingStatusAdmin = async (
  id: string,
  statusData: UpdateBookingStatusDto
): Promise<Booking> => {
  const response = await api.patch<Booking>(
    `/bookings/${id}/status`,
    statusData
  );
  return response.data;
};
