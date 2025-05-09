// frontend/src/pages/UserProfilePage.tsx
import React, { useState } from "react"; // Hapus useEffect jika tidak fetch profile
import { useAuth } from "../hooks/useAuth";
// Hapus impor UserResponseDto jika state profile dihapus
// import type { UserResponseDto } from "../types";
import styles from "./UserProfilePage.module.css";
import { getApiErrorMessage } from "../utils/errorUtils";

const UserProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  // Hapus state loading & error yang terkait fetch profile jika tidak fetch
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // State untuk form ganti password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false); // Dipakai di JSX
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(
    null
  ); // Dipakai di JSX
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<
    string | null
  >(null); // Dipakai di JSX

  // Handler ini dipakai oleh form onSubmit
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordChangeError(
        "New password must be at least 6 characters long."
      );
      return;
    }
    setPasswordChangeLoading(true);
    console.log("Attempting to change password with old:", oldPassword);
    try {
      // TODO: Implementasikan pemanggilan API sesungguhnya untuk ganti password
      // Contoh: await changePasswordService({ oldPassword, newPassword });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulasi API call
      setPasswordChangeSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword(""); // Reset field setelah sukses
    } catch (err: any) {
      setPasswordChangeError(
        getApiErrorMessage(
          err,
          "Failed to change password. Old password might be incorrect."
        )
      );
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // Langsung gunakan authUser karena tidak ada fetch profile terpisah
  const displayUser = authUser;

  // Hapus cek loading/error fetch profile
  if (!displayUser)
    return <p className="text-center mt-5">User data not available.</p>;

  return (
    <div className={styles.profilePage}>
      <h1>My Profile</h1>
      <div className={`${styles.profileCard} card`}>
        <div className="card-body">
          <h3 className="card-title">Account Information</h3>
          <p>
            <strong>Username:</strong> {displayUser.username}
          </p>
          <p>
            <strong>User ID:</strong> {displayUser.id}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className={styles.roleBadge}>{displayUser.role}</span>
          </p>
          {/* Tampilkan data lain jika ada di tipe User Anda */}
          {/* {displayUser.createdAt && <p><strong>Member Since:</strong> {new Date(displayUser.createdAt).toLocaleDateString()}</p>} */}
        </div>
      </div>

      {/* Card Ganti Password - Gunakan state dan handler */}
      <div className={`${styles.passwordCard} card mt-4`}>
        <div className="card-body">
          <h3 className="card-title">Change Password</h3>
          {/* Tampilkan pesan error/sukses ganti password */}
          {passwordChangeError && (
            <p className="error-message">{passwordChangeError}</p>
          )}
          {passwordChangeSuccess && (
            <p className="success-message">{passwordChangeSuccess}</p>
          )}

          {/* Gunakan handlePasswordChangeSubmit */}
          <form onSubmit={handlePasswordChangeSubmit}>
            <div className="form-group">
              <label htmlFor="oldPassword">Current Password</label>
              {/* Gunakan state & setter & loading state */}
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                disabled={passwordChangeLoading}
                autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              {/* Gunakan state & setter & loading state */}
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={passwordChangeLoading}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              {/* Gunakan state & setter & loading state */}
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={passwordChangeLoading}
                autoComplete="new-password"
              />
            </div>
            {/* Gunakan loading state */}
            <button
              type="submit"
              className="button primary"
              disabled={passwordChangeLoading}
            >
              {passwordChangeLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
