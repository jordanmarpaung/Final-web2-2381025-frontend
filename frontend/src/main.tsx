// frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.css"; // Impor CSS Global Utama
import "./App.css"; // Impor CSS spesifik App jika ada
import { AuthProvider } from "./contexts/AuthContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
