// frontend/src/types/index.ts

// --- User & Auth ---
export interface User {
  // Tetap interface
  id: string;
  username: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}
// Export DTO yang diperlukan untuk Admin/User Pages
export type UserResponseDto = User; // Anggap sama dengan User untuk sekarang
export interface UpdateUserDto {
  // Tetap interface
  username?: string;
  role?: "user" | "admin";
}

export interface AuthResponse {
  // Tetap interface
  access_token: string;
  user: User;
}

export interface LoginDto {
  // Tetap interface
  username: string;
  password: string;
}

export interface RegisterDto extends LoginDto {} // Tetap interface

// --- Hotel ---
export interface Hotel {
  // Tetap interface
  id: string;
  name: string;
  location: string;
  description?: string;
  pricePerNight: number;
  availableRooms: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelDto {
  // Tetap interface
  name: string;
  location: string;
  description?: string;
  pricePerNight: number;
  availableRooms: number;
  imageUrl?: string;
}

export interface UpdateHotelDto extends Partial<CreateHotelDto> {} // Tetap interface

export interface QueryHotelParams {
  // Tetap interface
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

// --- Booking ---
// Gunakan const enum untuk menghindari error TS1294
export const enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface Booking {
  // Tetap interface
  id: string;
  userId: string;
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: BookingStatus; // Menggunakan const enum
  createdAt: string;
  updatedAt: string;
  hotel: Hotel;
  user?: User;
}

export interface CreateBookingDto {
  // Tetap interface
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface UpdateBookingStatusDto {
  // Tetap interface
  status: BookingStatus;
}

export interface QueryBookingParams {
  // Tetap interface
  userId?: string;
  hotelId?: string;
  status?: BookingStatus;
}

// --- API Error Response ---
export interface ApiErrorDetail {
  // Tetap interface
  message: string | string[];
  error?: string;
  statusCode: number;
}
