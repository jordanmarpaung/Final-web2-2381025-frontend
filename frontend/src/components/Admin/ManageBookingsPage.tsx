// frontend/src/pages/Admin/ManageBookingsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import type {
  Booking,
  QueryBookingParams,
  UpdateBookingStatusDto,
  ApiErrorDetail,
} from "../../types"; // TYPE ONLY
import { BookingStatus } from "../../types"; // Enum OK
import {
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
} from "../../services/bookingService"; // Impor service admin
import styles from "./ManageBookingsPage.module.css"; // Pastikan file CSS ini dibuat
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../utils/errorUtils";
// import type { AxiosError } from 'axios'; // Tidak dipakai langsung

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null
  ); // ID booking yg sedang diupdate statusnya

  // State untuk filter
  const [filterUserId, setFilterUserId] = useState("");
  const [filterHotelId, setFilterHotelId] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "">("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: QueryBookingParams = {};
      if (filterUserId.trim()) params.userId = filterUserId.trim(); // Kirim hanya jika tidak kosong
      if (filterHotelId.trim()) params.hotelId = filterHotelId.trim(); // Kirim hanya jika tidak kosong
      if (filterStatus) params.status = filterStatus;

      const data = await getAllBookingsAdmin(params);
      // Urutkan berdasarkan tanggal pembuatan terbaru
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBookings(data);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to fetch bookings."));
    } finally {
      setLoading(false);
    }
  }, [filterUserId, filterHotelId, filterStatus]); // Dependensi filter

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const clearMessages = () => {
    setActionError(null);
    setActionSuccess(null);
  };

  const handleStatusChange = async (
    bookingId: string,
    newStatus: BookingStatus
  ) => {
    clearMessages();
    setUpdatingBookingId(bookingId);
    try {
      const statusData: UpdateBookingStatusDto = { status: newStatus };
      await updateBookingStatusAdmin(bookingId, statusData);
      setActionSuccess(
        `Booking ${bookingId.substring(
          0,
          8
        )}... status updated to ${newStatus}.`
      );
      // Refresh list dengan memanggil fetchBookings atau update local state
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );
      // fetchBookings(); // Alternatif: Panggil ulang API
    } catch (err: any) {
      setActionError(
        getApiErrorMessage(
          err,
          `Failed to update status for booking ${bookingId.substring(0, 8)}...`
        )
      );
      // Kembalikan nilai select jika gagal? Bisa ditambahkan jika perlu.
    } finally {
      setUpdatingBookingId(null);
    }
  };

  // Handler untuk form filter
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(); // Trigger fetch dengan filter baru
  };

  // Handler untuk clear filter
  const clearFilters = () => {
    setFilterUserId("");
    setFilterHotelId("");
    setFilterStatus("");
    // fetchBookings akan terpanggil otomatis via useEffect setelah state direset
  };

  if (loading) return <div className="loader mt-5"></div>;
  // Tampilkan error fetch utama jika ada
  if (error && bookings.length === 0)
    return <p className="error-message text-center mt-5">{error}</p>;

  return (
    <div className={styles.manageBookingsPage}>
      <h1 className={styles.pageTitle}>Manage All Bookings</h1>
      {actionSuccess && (
        <p className={`${styles.actionMessage} success-message`}>
          {actionSuccess}
        </p>
      )}
      {actionError && (
        <p className={`${styles.actionMessage} error-message`}>{actionError}</p>
      )}
      {error && (
        <p className={`${styles.actionMessage} error-message`}>
          Error fetching data: {error}
        </p>
      )}{" "}
      {/* Tampilkan juga error fetch */}
      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className={styles.filterForm}>
        <div className={styles.filterGroup}>
          <label htmlFor="filterUserId">User ID:</label>
          <input
            type="text"
            id="filterUserId"
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            placeholder="Filter by User UUID"
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="filterHotelId">Hotel ID:</label>
          <input
            type="text"
            id="filterHotelId"
            value={filterHotelId}
            onChange={(e) => setFilterHotelId(e.target.value)}
            placeholder="Filter by Hotel UUID"
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="filterStatus">Status:</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as BookingStatus | "")
            }
          >
            <option value="">All Statuses</option>
            {Object.values(BookingStatus).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterActions}>
          <button type="submit" className="button primary">
            Filter
          </button>
          <button
            type="button"
            className="button secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </form>
      <h2 className={styles.tableTitle}>Bookings ({bookings.length})</h2>
      <div className={styles.tableContainer}>
        <table className={styles.bookingsTable}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Hotel</th>
              <th>User</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total (Rp)</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 &&
              !loading && ( // Tampilkan pesan jika tidak ada hasil filter
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    No bookings found matching criteria.
                  </td>
                </tr>
              )}
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <abbr title={booking.id}>
                    {booking.id.substring(0, 8)}...
                  </abbr>
                </td>
                <td>
                  {booking.hotel ? (
                    <Link
                      to={`/hotels/${booking.hotel.id}`}
                      title={booking.hotel.name}
                    >
                      {booking.hotel.name.substring(0, 25)}
                      {booking.hotel.name.length > 25 ? "..." : ""}
                    </Link>
                  ) : (
                    <abbr title={booking.hotelId}>Unknown Hotel</abbr>
                  )}
                </td>
                <td>
                  {/* Idealnya backend mengirim username, jika tidak tampilkan ID */}
                  <abbr title={booking.userId}>
                    {booking.user?.username ||
                      booking.userId.substring(0, 8) + "..."}
                  </abbr>
                </td>
                <td>
                  {new Date(booking.checkInDate).toLocaleDateString("en-CA")}
                </td>
                {/* YYYY-MM-DD */}
                <td>
                  {new Date(booking.checkOutDate).toLocaleDateString("en-CA")}
                </td>
                <td style={{ textAlign: "right" }}>
                  {Number(booking.totalPrice).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[booking.status.toLowerCase()]
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionSelectContainer}>
                    <select
                      aria-label={`Change status for booking ${booking.id.substring(
                        0,
                        8
                      )}`}
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(
                          booking.id,
                          e.target.value as BookingStatus
                        )
                      }
                      disabled={updatingBookingId === booking.id}
                      className={styles.statusSelect}
                    >
                      {/* Tampilkan status saat ini, lalu opsi lain */}
                      {Object.values(BookingStatus).map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    {updatingBookingId === booking.id && (
                      <span className={styles.miniLoader}></span>
                    )}
                  </div>
                  {/* Anda bisa menambahkan tombol delete di sini jika ada endpointnya */}
                  {/* <button className="button danger small" style={{marginTop: '5px'}}>Delete</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookingsPage;
