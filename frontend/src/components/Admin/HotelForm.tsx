// frontend/src/components/Admin/HotelForm.tsx
import React, { useState, useEffect } from "react";
import type { FormEvent } from "react"; // TYPE ONLY
import type { CreateHotelDto, Hotel, UpdateHotelDto } from "../../types"; // TYPE ONLY
import styles from "./HotelForm.module.css";
import { getApiErrorMessage } from "../../utils/errorUtils"; // Pastikan path benar

interface HotelFormProps {
  hotel?: Hotel | null;
  onSubmit: (data: CreateHotelDto | UpdateHotelDto) => Promise<void>;
  onCancel: () => void;
}

const HotelForm: React.FC<HotelFormProps> = ({ hotel, onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState<string>("");
  const [availableRooms, setAvailableRooms] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hotel) {
      setName(hotel.name);
      setLocation(hotel.location);
      setDescription(hotel.description || "");
      setPricePerNight(String(hotel.pricePerNight));
      setAvailableRooms(String(hotel.availableRooms));
      setImageUrl(hotel.imageUrl || "");
    } else {
      setName("");
      setLocation("");
      setDescription("");
      setPricePerNight("");
      setAvailableRooms("");
      setImageUrl("");
    }
    setError(null);
    setIsLoading(false);
  }, [hotel]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const priceNum = parseFloat(pricePerNight);
    const roomsNum = parseInt(availableRooms, 10);

    if (isNaN(priceNum) || priceNum < 0) {
      setError("Price per night must be a valid non-negative number.");
      return;
    }
    if (isNaN(roomsNum) || roomsNum < 0 || !Number.isInteger(roomsNum)) {
      setError("Available rooms must be a valid non-negative whole number.");
      return;
    }

    const hotelData = {
      name,
      location,
      description: description.trim() || undefined,
      pricePerNight: priceNum,
      availableRooms: roomsNum,
      imageUrl: imageUrl.trim() || undefined,
    };

    setIsLoading(true);
    try {
      await onSubmit(hotel ? hotelData : hotelData);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to save hotel."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.hotelFormContainer}>
      <h3>{hotel ? "Edit Hotel Details" : "Create New Hotel"}</h3>
      <form onSubmit={handleSubmit} className={styles.hotelForm}>
        {error && (
          <p className={`${styles.formError} error-message`}>{error}</p>
        )}
        <div className={styles.formColumn}>
          <div className="form-group">
            <label htmlFor={`hotel-name-${hotel?.id || "new"}`}>Name</label>
            <input
              type="text"
              id={`hotel-name-${hotel?.id || "new"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`hotel-location-${hotel?.id || "new"}`}>
              Location
            </label>
            <input
              type="text"
              id={`hotel-location-${hotel?.id || "new"}`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              minLength={3}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`hotel-price-${hotel?.id || "new"}`}>
              Price Per Night (Rp)
            </label>
            <input
              type="number"
              id={`hotel-price-${hotel?.id || "new"}`}
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              required
              min="0"
              step="1000"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`hotel-rooms-${hotel?.id || "new"}`}>
              Available Rooms
            </label>
            <input
              type="number"
              id={`hotel-rooms-${hotel?.id || "new"}`}
              value={availableRooms}
              onChange={(e) => setAvailableRooms(e.target.value)}
              required
              min="0"
              step="1"
              disabled={isLoading}
            />
          </div>
        </div>
        <div className={styles.formColumn}>
          <div className="form-group">
            <label htmlFor={`hotel-description-${hotel?.id || "new"}`}>
              Description
            </label>
            <textarea
              id={`hotel-description-${hotel?.id || "new"}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`hotel-imageUrl-${hotel?.id || "new"}`}>
              Image URL (Optional)
            </label>
            <input
              type="url"
              id={`hotel-imageUrl-${hotel?.id || "new"}`}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? "Saving..." : hotel ? "Update Hotel" : "Create Hotel"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default HotelForm;
