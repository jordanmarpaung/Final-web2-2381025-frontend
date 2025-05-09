// frontend/src/pages/Admin/ManageHotelsPage.tsx -> SEHARUSNYA DI components/Admin/ManageHotelsPage.tsx
// Saya akan tetap menulisnya seolah-olah ada di pages/Admin untuk konsistensi dengan App.tsx sebelumnya
// TAPI Anda harus meletakkannya sesuai struktur folder Anda atau ubah impor di App.tsx
import React, { useEffect, useState, useCallback } from "react";
import type { Hotel, CreateHotelDto, UpdateHotelDto } from "../../types"; // TYPE ONLY
import {
  createHotel,
  updateHotel,
  deleteHotel,
} from "../../services/hotelService";
import HotelForm from "../../components/Admin/HotelForm"; // Path ke komponen form
import styles from "./ManageHotelsPage.module.css"; // Path CSS
import { getApiErrorMessage } from "../../utils/errorUtils";

const ManageHotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allHotelsData = await import("../../services/hotelService").then(
        (m) => m.getAllHotels()
      );
      setHotels(allHotelsData);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to fetch hotels"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const clearMessages = () => {
    setActionError(null);
    setActionSuccess(null);
  };
  const handleShowCreateForm = () => {
    clearMessages();
    setIsCreating(true);
    setEditingHotel(null);
  };
  const handleShowEditForm = (hotel: Hotel) => {
    clearMessages();
    setEditingHotel(hotel);
    setIsCreating(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancelForm = () => {
    clearMessages();
    setIsCreating(false);
    setEditingHotel(null);
  };

  const handleSubmitForm = useCallback(
    async (hotelData: CreateHotelDto | UpdateHotelDto) => {
      clearMessages();
      try {
        if (editingHotel) {
          const updatedHotel = await updateHotel(
            editingHotel.id,
            hotelData as UpdateHotelDto
          );
          setActionSuccess(
            `Hotel "${updatedHotel.name}" updated successfully!`
          );
        } else {
          const newHotel = await createHotel(hotelData as CreateHotelDto);
          setActionSuccess(`Hotel "${newHotel.name}" created successfully!`);
        }
        fetchHotels();
        handleCancelForm();
      } catch (err: any) {
        setActionError(getApiErrorMessage(err, "Failed to save hotel."));
        console.error("Save hotel error:", err);
        throw err; // Rethrow
      }
    },
    [editingHotel, fetchHotels]
  );

  const handleDelete = useCallback(
    async (id: string, hotelName: string) => {
      clearMessages();
      if (
        window.confirm(
          `Are you sure you want to delete the hotel "${hotelName}"?`
        )
      ) {
        try {
          await deleteHotel(id);
          setActionSuccess(`Hotel "${hotelName}" deleted successfully.`);
          fetchHotels();
          if (editingHotel?.id === id) {
            handleCancelForm();
          }
        } catch (err: any) {
          setActionError(getApiErrorMessage(err, "Failed to delete hotel."));
        }
      }
    },
    [editingHotel, fetchHotels]
  ); // Hapus dependency yg tidak perlu

  if (loading) return <div className="loader mt-5"></div>;
  if (error) return <p className="error-message text-center mt-5">{error}</p>;

  return (
    <div className={styles.manageHotelsPage}>
      <h1 className={styles.pageTitle}>Manage Hotel Listings</h1>
      {actionSuccess && (
        <p className={`${styles.actionMessage} success-message`}>
          {actionSuccess}
        </p>
      )}
      {actionError && !isCreating && !editingHotel && (
        <p className={`${styles.actionMessage} error-message`}>{actionError}</p>
      )}

      {!isCreating && !editingHotel && (
        <div className={styles.addHotelButtonContainer}>
          <button className="button primary" onClick={handleShowCreateForm}>
            <span role="img" aria-label="add">
              ➕
            </span>{" "}
            Add New Hotel
          </button>
        </div>
      )}

      {(isCreating || editingHotel) && (
        <HotelForm
          key={editingHotel ? editingHotel.id : "create"}
          hotel={editingHotel}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
        />
      )}

      <h2 className={styles.tableTitle}>Existing Hotels ({hotels.length})</h2>
      <div className={styles.tableContainer}>
        <table className={styles.hotelsTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Price/Night (Rp)</th>
              <th>Rooms Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No hotels found.
                </td>
              </tr>
            ) : (
              hotels.map((hotel) => (
                <tr
                  key={hotel.id}
                  className={
                    editingHotel?.id === hotel.id ? styles.editingRow : ""
                  }
                >
                  <td>
                    <img
                      src={
                        hotel.imageUrl ||
                        "https://via.placeholder.com/80x50.png?text=N/A"
                      }
                      alt={hotel.name}
                      className={styles.tableImage}
                    />
                  </td>
                  <td>{hotel.name}</td>
                  <td>{hotel.location}</td>
                  <td style={{ textAlign: "right" }}>
                    {Number(hotel.pricePerNight).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {hotel.availableRooms}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleShowEditForm(hotel)}
                        disabled={editingHotel?.id === hotel.id}
                      >
                        Edit
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDelete(hotel.id, hotel.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageHotelsPage;
