// frontend/src/components/BookingForm.tsx
import React, { useState } from "react";
import type { FormEvent } from "react"; // TYPE ONLY
import { useNavigate } from "react-router-dom";
import type { CreateBookingDto } from "../types"; // TYPE ONLY
import { createBooking } from "../services/bookingService";
import styles from "./BookingForm.module.css";
// Hapus impor yang tidak dipakai jika ada (AxiosError, ApiErrorDetail)
import { getApiErrorMessage } from "../utils/errorUtils";

interface BookingFormProps {
  hotelId: string;
  availableRooms: number;
  pricePerNight: number;
}

const BookingForm: React.FC<BookingFormProps> = ({
  hotelId,
  availableRooms,
  pricePerNight,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!checkInDate || !checkOutDate) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    const cin = new Date(checkInDate);
    const cout = new Date(checkOutDate);
    if (cout <= cin) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    if (cin < new Date(today)) {
      setError("Check-in date cannot be in the past.");
      return;
    }
    if (availableRooms <= 0) {
      setError("Sorry, no rooms available for booking at this hotel.");
      return;
    }

    setLoading(true);
    const bookingData: CreateBookingDto = {
      hotelId,
      checkInDate,
      checkOutDate,
    };
    try {
      const newBooking = await createBooking(bookingData);
      setSuccessMessage(
        `Booking successful! Your booking ID is ${
          newBooking.id
        }. Total Price: Rp ${newBooking.totalPrice.toLocaleString()}. You will be redirected to your bookings page.`
      );
      setCheckInDate("");
      setCheckOutDate("");
      setTimeout(() => navigate("/my-bookings"), 3500);
    } catch (err: any) {
      setError(
        getApiErrorMessage(err, "Failed to create booking. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  let totalNights = 0;
  let estimatedPrice = 0;
  if (checkInDate && checkOutDate) {
    const cin = new Date(checkInDate);
    const cout = new Date(checkOutDate);
    if (cout > cin) {
      const diffTime = Math.abs(cout.getTime() - cin.getTime());
      totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      estimatedPrice = totalNights * pricePerNight;
    }
  }

  return (
    <div className={styles.bookingFormContainer}>
      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className={`form-group ${styles.dateGroup}`}>
          <div>
            <label htmlFor="checkInDate">Check-in Date:</label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
              min={today}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="checkOutDate">Check-out Date:</label>
            <input
              type="date"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
              min={checkInDate || today}
              disabled={loading || !checkInDate}
            />
          </div>
        </div>

        {/* PERBAIKAN: Letakkan elemen JSX yang valid di dalam kondisi */}
        {totalNights > 0 && (
          <div className={styles.summary}>
            <p>
              Number of nights: <strong>{totalNights}</strong>
            </p>
            <p>
              Estimated total price:{" "}
              <strong>Rp {estimatedPrice.toLocaleString()}</strong>
            </p>
          </div>
        )}

        <button
          type="submit"
          className="primary"
          disabled={
            loading || availableRooms <= 0 || !checkInDate || !checkOutDate
          }
        >
          {loading
            ? "Processing Booking..."
            : availableRooms > 0
            ? "Confirm Booking"
            : "Hotel Sold Out"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
