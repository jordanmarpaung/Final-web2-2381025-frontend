// frontend/src/pages/HotelDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Hotel, ApiErrorDetail } from "../types"; // TYPE ONLY
import { getHotelById } from "../services/hotelService";
import BookingForm from "../components/BookingForm"; // Pastikan path ini benar
import { useAuth } from "../hooks/useAuth";
import styles from "./HotelDetailPage.module.css";
import type { AxiosError } from "axios"; // TYPE ONLY
import { getApiErrorMessage } from "../utils/errorUtils"; // Pastikan path ini benar

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id akan selalu string dari URL
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth(); // Ambil user juga untuk potensi fitur admin
  const navigate = useNavigate();
  const defaultImageUrl =
    "https://via.placeholder.com/800x450.png?text=Hotel+Image+Not+Available";

  useEffect(() => {
    if (!id) {
      setError("Hotel ID is missing from the URL.");
      setLoading(false);
      return;
    }
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getHotelById(id);
        setHotel(data);
      } catch (err: any) {
        const axiosError = err as AxiosError<ApiErrorDetail>;
        if (axiosError.response?.status === 404) {
          setError(`Hotel with ID "${id}" not found.`);
        } else {
          setError(getApiErrorMessage(err, "Failed to fetch hotel details."));
        }
        console.error("Fetch hotel detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <div className="loader mt-5"></div>;
  // Jika error dan hotel tidak ada, tampilkan error
  if (error && !hotel)
    return (
      <p className="error-message text-center mt-5">
        {error} <Link to="/hotels">Go back to hotels</Link>
      </p>
    );
  // Jika tidak loading, tidak error, tapi hotel tetap null (kasus aneh)
  if (!hotel)
    return (
      <p className="text-center mt-5">
        Hotel data not available. <Link to="/hotels">Go back to hotels</Link>
      </p>
    );

  return (
    <div className={styles.hotelDetailPage}>
      {/* Gambar Hotel */}
      <div className={styles.imageContainer}>
        <img
          src={hotel.imageUrl || defaultImageUrl}
          alt={`View of ${hotel.name}`}
          className={styles.hotelImageLarge}
          onError={(e) => (e.currentTarget.src = defaultImageUrl)}
        />
      </div>

      {/* Konten Detail */}
      <div className={styles.detailsContent}>
        <h1 className={styles.hotelName}>{hotel.name}</h1>
        <p className={styles.location}>
          <span role="img" aria-label="location pin">
            📍
          </span>{" "}
          {hotel.location}
        </p>
        <p className={styles.description}>
          {hotel.description ||
            "No detailed description available for this hotel."}
        </p>

        {/* Info Harga & Kamar */}
        <div className={styles.infoGrid}>
          <div>
            <strong>Price per night:</strong>
            <span className={styles.price}>
              {" "}
              Rp {Number(hotel.pricePerNight).toLocaleString()}
            </span>
          </div>
          <div>
            <strong>Rooms available:</strong>
            <span
              className={
                hotel.availableRooms > 0
                  ? styles.roomsAvailable
                  : styles.roomsUnavailable
              }
            >
              {hotel.availableRooms > 0 ? hotel.availableRooms : "Sold Out"}
            </span>
          </div>
        </div>

        {/* Form Booking atau Pesan Login/SoldOut */}
        {isAuthenticated ? ( // Cek apakah user sudah login
          hotel.availableRooms > 0 ? ( // Cek apakah kamar tersedia
            <div className={styles.bookingSection}>
              <h2 className={styles.bookingTitle}>Make a Reservation</h2>
              <BookingForm
                hotelId={hotel.id}
                availableRooms={hotel.availableRooms}
                pricePerNight={hotel.pricePerNight}
              />
            </div>
          ) : (
            // Jika kamar tidak tersedia (sold out)
            <p className={`${styles.bookingMessage} ${styles.soldOutMessage}`}>
              We are sorry, this hotel is currently sold out.
            </p>
          )
        ) : (
          // Jika user belum login
          <p className={styles.bookingMessage}>
            Please{" "}
            <button
              className="primary"
              onClick={() =>
                navigate("/login", { state: { from: `/hotels/${id}` } })
              }
            >
              Login
            </button>{" "}
            or{" "}
            <button className="secondary" onClick={() => navigate("/register")}>
              Register
            </button>{" "}
            to make a booking.
          </p>
        )}

        {/* PERBAIKAN: Ganti komentar dengan elemen JSX yang valid */}
        {user?.role === "admin" && (
          <div className={styles.adminActions}>
            <hr />
            <h4>Admin Actions</h4>
            {/* Contoh tombol Edit */}
            <button
              className="button secondary"
              onClick={() => navigate(`/admin/manage-hotels?edit=${hotel.id}`)}
            >
              Edit Hotel Details
            </button>
            {/* Tambahkan tombol atau link aksi admin lainnya di sini jika perlu */}
            {/* Misalnya: <button className="button danger">Delete Hotel</button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetailPage;
