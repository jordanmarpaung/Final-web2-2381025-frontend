// frontend/src/utils/errorUtils.ts
import type { AxiosError } from "axios"; // TYPE ONLY
import type { ApiErrorDetail } from "../types"; // TYPE ONLY

export const getApiErrorMessage = (
  error: any,
  defaultMessage: string = "An unexpected error occurred."
): string => {
  const axiosError = error as AxiosError<ApiErrorDetail>;
  const backendMessage = axiosError.response?.data?.message;

  if (Array.isArray(backendMessage)) {
    return backendMessage[0];
  }
  if (typeof backendMessage === "string") {
    return backendMessage;
  }
  return axiosError?.message || defaultMessage; // Perbaiki fallback jika axiosError null
};
