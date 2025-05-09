// frontend/src/pages/Admin/ManageUsersPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import type { UserResponseDto, UpdateUserDto } from "../../types"; // TYPE ONLY
import {
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../../services/userService";
import styles from "./ManageUsersPage.module.css"; // Pastikan CSS ini dibuat
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../utils/errorUtils";

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: loggedInUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gunakan impor dinamis di sini sebagai contoh alternatif
      const userService = await import("../../services/userService");
      const allUsersData = await userService.getAllUsers();
      setUsers(allUsersData);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to fetch users."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const clearMessages = () => {
    setActionError(null);
    setActionSuccess(null);
  };
  const handleEditClick = (userToEdit: UserResponseDto) => {
    clearMessages();
    setEditingUser({ ...userToEdit });
  };
  const handleCancelEdit = () => {
    clearMessages();
    setEditingUser(null);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editingUser) return;
    setEditingUser({
      ...editingUser,
      role: e.target.value as "user" | "admin",
    });
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, username: e.target.value });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    clearMessages();
    setIsSubmitting(true);
    const updateData: UpdateUserDto = {
      username: editingUser.username,
      role: editingUser.role,
    };
    try {
      const updatedUser = await updateUserByAdmin(editingUser.id, updateData);
      setActionSuccess(`User "${updatedUser.username}" updated successfully.`);
      fetchUsers();
      handleCancelEdit();
    } catch (err: any) {
      setActionError(getApiErrorMessage(err, "Failed to update user."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    clearMessages();
    if (loggedInUser?.id === userId) {
      alert("Admins cannot delete their own account.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete the user "${username}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteUserByAdmin(userId);
        setActionSuccess(`User "${username}" deleted successfully.`);
        fetchUsers();
        if (editingUser?.id === userId) {
          handleCancelEdit();
        }
      } catch (err: any) {
        setActionError(getApiErrorMessage(err, "Failed to delete user."));
      }
    }
  };

  if (loading) return <div className="loader mt-5"></div>;
  if (error) return <p className="error-message text-center mt-5">{error}</p>;

  return (
    <div className={styles.manageUsersPage}>
      <h1 className={styles.pageTitle}>Manage Users</h1>
      {actionSuccess && (
        <p className={`${styles.actionMessage} success-message`}>
          {actionSuccess}
        </p>
      )}
      {actionError && !editingUser && (
        <p className={`${styles.actionMessage} error-message`}>{actionError}</p>
      )}

      {editingUser && (
        <div className={`${styles.editFormContainer} card`}>
          <form onSubmit={handleUpdateSubmit} className="card-body">
            <h3 className={styles.editTitle}>
              Editing User: {editingUser.username}
            </h3>
            {actionError && editingUser && (
              <p className="error-message">{actionError}</p>
            )}
            <div className={styles.editGrid}>
              <div className="form-group">
                <label htmlFor="edit-username">Username:</label>
                <input
                  type="text"
                  id="edit-username"
                  value={editingUser.username}
                  onChange={handleUsernameChange}
                  required
                  minLength={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-role">Role:</label>
                <select
                  id="edit-role"
                  value={editingUser.role}
                  onChange={handleRoleChange}
                  disabled={isSubmitting || loggedInUser?.id === editingUser.id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className={styles.editActions}>
              <button
                type="submit"
                className="button primary"
                disabled={isSubmitting}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className={styles.tableTitle}>All Users ({users.length})</h2>
      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Member Since</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr
                key={user.id}
                className={editingUser?.id === user.id ? styles.editingRow : ""}
              >
                <td>
                  <abbr title={user.id}>{user.id.substring(0, 8)}...</abbr>
                </td>
                <td>{user.username}</td>
                <td>
                  <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => handleEditClick(user)}
                      disabled={editingUser?.id === user.id}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDelete(user.id, user.username)}
                      disabled={loggedInUser?.id === user.id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageUsersPage;
