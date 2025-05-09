// frontend/src/pages/MyBookingsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import type { Booking } from "../types"; // TYPE ONLY, Hapus ApiErrorDetail
import { BookingStatus } from "../types"; // Enum OK
import { getMyBookings, cancelMyBooking } from "../services/bookingService";
import styles from "./MyBookingsPage.module.css";
import { Link } from "react-router-dom";
// Hapus AxiosError
import { getApiErrorMessage } from "../utils/errorUtils";

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBookings(data);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to fetch your bookings."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }
    setCancellingId(bookingId);
    setActionMessage(null);
    try {
      await cancelMyBooking(bookingId);
      setActionMessage({
        type: "success",
        text: "Booking cancelled successfully.",
      });
      fetchBookings();
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to cancel booking."),
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="loader mt-5"></div>;
  if (error) return <p className="error-message text-center mt-5">{error}</p>;

  // --- JSX Lengkap ---
  return (
    <div className={styles.myBookingsPage}>
      <h1 className={styles.pageTitle}>My Reservations</h1>

      {actionMessage && (
        <p
          className={`${styles.actionMessage} ${
            actionMessage.type === "success"
              ? "success-message"
              : "error-message"
          }`}
        >
          {actionMessage.text}
        </p>
      )}

      {bookings.length === 0 ? (
        <div className={styles.noBookings}>
          <p>You haven't made any bookings yet.</p>
          <Link to="/hotels" className="button primary">
            Find a Hotel
          </Link>
        </div>
      ) : (
        <div className={styles.bookingGrid}>
          {bookings.map((booking) => (
            <div key={booking.id} className={`${styles.bookingCard} card`}>
              <div className={styles.cardHeader}>
                <Link to={`/hotels/${booking.hotel.id}`}>
                  <img
                    src={
                      booking.hotel.imageUrl ||
                      "https://via.placeholder.com/200x120.png?text=Hotel"
                    }
                    alt={booking.hotel.name}
                    className={styles.hotelImageSmall}
                  />
                </Link>
                <div className={styles.hotelDetails}>
                  <h3 className={styles.hotelName}>
                    <Link to={`/hotels/${booking.hotel.id}`}>
                      {booking.hotel.name}
                    </Link>
                  </h3>
                  <p className={styles.hotelLocation}>
                    {booking.hotel.location}
                  </p>
                </div>
              </div>
              <div className={`${styles.bookingInfo} card-body`}>
                <p>
                  <strong>Booking ID:</strong> {booking.id.substring(0, 8)}...
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {new Date(booking.checkInDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Total Price:</strong> Rp{" "}
                  {Number(booking.totalPrice).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[booking.status.toLowerCase()]
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </p>
                <p className={styles.bookedOn}>
                  <strong>Booked on:</strong>{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
              {booking.status !== BookingStatus.CANCELLED && (
                <div className={styles.cardActions}>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="button danger"
                    disabled={cancellingId === booking.id}
                  >
                    {cancellingId === booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  // --- Akhir JSX ---
};

export default MyBookingsPage;
