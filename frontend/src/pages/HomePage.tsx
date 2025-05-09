// frontend/src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Hotel } from "../types"; // TYPE ONLY, ApiErrorDetail dihapus
import { getAllHotels } from "../services/hotelService";
import HotelCard from "../components/HotelCard";
import styles from "./HomePage.module.css";
import { useAuth } from "../hooks/useAuth";
// Hapus AxiosError
import { getApiErrorMessage } from "../utils/errorUtils";

const HomePage: React.FC = () => {
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { available: true };
        const allAvailableHotels = await getAllHotels(params);
        setFeaturedHotels(allAvailableHotels.slice(0, 3));
      } catch (err: any) {
        // Tetap gunakan getApiErrorMessage untuk konsistensi
        setError(getApiErrorMessage(err, "Failed to load featured hotels."));
        console.error("Fetch featured hotels error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedHotels();
  }, []);

  // --- JSX Lengkap ---
  return (
    <div className={styles.homePage}>
      <header className={styles.heroSection}>
        <div className={`${styles.heroContent} container`}>
          <h1>Find Your Perfect Stay</h1>
          <p className={styles.heroSubtitle}>
            Discover amazing hotels and book your next adventure with unmatched
            ease.
          </p>
          <div className={styles.heroActions}>
            <Link to="/hotels" className="button primary large">
              Explore Hotels
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="button secondary large">
                Sign Up Now
              </Link>
            )}
          </div>
          {isAuthenticated && user && (
            <p className={styles.welcomeMessage}>
              Welcome back, {user.username}!
            </p>
          )}
        </div>
        <div className={styles.heroOverlay}></div>
      </header>

      <section className={`${styles.featuredHotelsSection} container`}>
        <h2 className={styles.sectionTitle}>Featured Stays</h2>
        {loading && <div className="loader"></div>}
        {error && <p className="error-message text-center">{error}</p>}
        {!loading && !error && featuredHotels.length === 0 && (
          <div className={styles.noHotelsMessage}>
            <p>No featured hotels available right now.</p>
            <Link to="/hotels" className="button primary">
              Browse All Hotels
            </Link>
          </div>
        )}
        {!loading && !error && featuredHotels.length > 0 && (
          <>
            <div className={styles.hotelGrid}>
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
            <div className={styles.viewAllContainer}>
              <Link to="/hotels" className="button secondary">
                View More Hotels
              </Link>
            </div>
          </>
        )}
      </section>

      <section className={styles.howItWorksSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <span className={styles.stepIcon}>🔍</span>
              <h3>Search</h3>
              <p>Find hotels by location or price.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepIcon}>📅</span>
              <h3>Select Dates</h3>
              <p>Choose your check-in and check-out dates.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepIcon}>✔️</span>
              <h3>Book</h3>
              <p>Confirm your booking instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  // --- Akhir JSX ---
};

export default HomePage;
