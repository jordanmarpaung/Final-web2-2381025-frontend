// frontend/src/pages/HotelsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import type { Hotel, QueryHotelParams } from "../types"; // TYPE ONLY
import { getAllHotels } from "../services/hotelService";
import HotelCard from "../components/HotelCard";
import styles from "./HotelsPage.module.css";
import { getApiErrorMessage } from "../utils/errorUtils";

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState<string>("");
  const [maxPriceFilter, setMaxPriceFilter] = useState<string>("");
  const [availableFilter, setAvailableFilter] = useState<string>("");

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: QueryHotelParams = {};
      if (locationFilter) params.location = locationFilter;
      if (minPriceFilter) params.minPrice = parseFloat(minPriceFilter);
      if (maxPriceFilter) params.maxPrice = parseFloat(maxPriceFilter);
      if (availableFilter === "true") params.available = true;
      if (availableFilter === "false") params.available = false;
      const data = await getAllHotels(params);
      setHotels(data);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to fetch hotels."));
    } finally {
      setLoading(false);
    }
  }, [locationFilter, minPriceFilter, maxPriceFilter, availableFilter]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault(); /* fetchHotels dipanggil via useEffect */
  };
  const clearFilters = () => {
    setLocationFilter("");
    setMinPriceFilter("");
    setMaxPriceFilter("");
    setAvailableFilter("");
  };

  return (
    <div className={styles.hotelsPage}>
      <h1 className={styles.pageTitle}>Explore Our Hotels</h1>
      <form onSubmit={handleFilterSubmit} className={styles.filterForm}>
        <div className={styles.filterGroup}>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="e.g., Bali"
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="minPrice">Min Price (Rp):</label>
          <input
            type="number"
            id="minPrice"
            value={minPriceFilter}
            onChange={(e) => setMinPriceFilter(e.target.value)}
            placeholder="e.g., 500000"
            min="0"
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="maxPrice">Max Price (Rp):</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(e.target.value)}
            placeholder="e.g., 2000000"
            min="0"
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="available">Availability:</label>
          <select
            id="available"
            value={availableFilter}
            onChange={(e) => setAvailableFilter(e.target.value)}
          >
            <option value="">Any</option>
            <option value="true">Available Only</option>
            <option value="false">Sold Out</option>
          </select>
        </div>
        <div className={styles.filterActions}>
          <button type="submit" className="button primary">
            Apply Filters
          </button>{" "}
          {/* Tombol submit tetap perlu untuk UX form standar */}
          <button
            type="button"
            className="button secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </form>

      {loading && <div className="loader mt-3"></div>}
      {error && <p className="error-message mt-3">{error}</p>}
      {!loading &&
        !error &&
        (hotels.length === 0 ? (
          <p className={styles.noHotelsMessage}>
            No hotels match your criteria. Try adjusting your filters.
          </p>
        ) : (
          <div className={styles.hotelGrid}>
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ))}
    </div>
  );
};

export default HotelsPage;
