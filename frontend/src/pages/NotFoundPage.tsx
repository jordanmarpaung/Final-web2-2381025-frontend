// frontend/src/pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router-dom";
// import styles from './NotFoundPage.module.css'; // Buat jika perlu styling khusus

const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 150px)", // Sesuaikan agar pas di bawah navbar
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{ fontSize: "6rem", margin: "0", color: "var(--primary-color)" }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          margin: "10px 0",
          color: "var(--text-color)",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          color: "var(--dark-gray-color)",
          maxWidth: "400px",
          marginBottom: "30px",
        }}
      >
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Link to="/" className="button primary">
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
