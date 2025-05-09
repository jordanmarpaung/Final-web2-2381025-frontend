// frontend/src/components/HotelCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Hotel } from "../types"; // TYPE ONLY
import styles from "./HotelCard.module.css";

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const defaultImageUrl =
    "https://via.placeholder.com/350x200.png?text=Hotel+Image+Not+Available";

  return (
    <div className={styles.hotelCard}>
      <Link to={`/hotels/${hotel.id}`} className={styles.cardLink}>
        <img
          src={hotel.imageUrl || defaultImageUrl}
          alt={`View of ${hotel.name}`}
          className={styles.hotelImage}
          onError={(e) => (e.currentTarget.src = defaultImageUrl)}
        />
        <div className={styles.hotelInfo}>
          <h3 className={styles.hotelName}>{hotel.name}</h3>
          <p className={styles.hotelLocation}>{hotel.location}</p>
          <div className={styles.priceAndRooms}>
            <p className={styles.hotelPrice}>
              Rp {Number(hotel.pricePerNight).toLocaleString()}
              <span className={styles.perNight}>/night</span>
            </p>
            {hotel.availableRooms > 0 ? (
              <p className={styles.hotelRoomsAvailable}>
                {hotel.availableRooms} room{hotel.availableRooms > 1 ? "s" : ""}{" "}
                left
              </p>
            ) : (
              <p className={styles.hotelRoomsUnavailable}>Sold Out</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HotelCard;
