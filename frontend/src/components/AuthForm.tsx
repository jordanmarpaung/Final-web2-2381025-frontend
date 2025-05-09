// frontend/src/components/AuthForm.tsx
import React, { useState } from "react";
import type { FormEvent } from "react"; // TYPE ONLY
import type { LoginDto, RegisterDto } from "../types"; // TYPE ONLY
import styles from "./AuthForm.module.css"; // Pastikan file CSS ini dibuat

interface AuthFormProps {
  formType: "login" | "register";
  onSubmit: (data: LoginDto | RegisterDto) => Promise<void>; // Union type
  loading: boolean;
  serverError: string | null;
  successMessage?: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formType,
  onSubmit,
  loading,
  serverError,
  successMessage,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Hanya untuk register

  const handleSubmit = (e: FormEvent) => {
    // Tipe FormEvent benar
    e.preventDefault();
    if (formType === "register" && password !== confirmPassword) {
      // Idealnya tampilkan error state, bukan alert
      alert("Passwords do not match!");
      return;
    }
    const data =
      formType === "register"
        ? { username, password } // Kirim data register
        : { username, password }; // Kirim data login
    onSubmit(data);
  };

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>
          {formType === "login" ? "Login to Your Account" : "Create an Account"}
        </h2>

        {/* Tampilkan pesan error atau sukses */}
        {serverError && (
          <p className={`${styles.message} ${styles.errorMessage}`}>
            {serverError}
          </p>
        )}
        {successMessage && (
          <p className={`${styles.message} ${styles.successMessage}`}>
            {successMessage}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            disabled={loading}
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            placeholder="Enter your password"
            autoComplete={
              formType === "login" ? "current-password" : "new-password"
            }
          />
        </div>

        {formType === "register" && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>
        )}

        <button
          type="submit"
          className="button primary"
          disabled={loading}
          style={{ width: "100%", marginTop: "10px" }}
        >
          {loading
            ? "Processing..."
            : formType === "login"
            ? "Login"
            : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
