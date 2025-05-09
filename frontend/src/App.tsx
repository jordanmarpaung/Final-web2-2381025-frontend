// frontend/src/App.tsx
import React, { Suspense, lazy } from "react";
import type { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import "./App.css";

// --- Pastikan Path Ini Benar Sesuai LOKASI FILE Anda ---
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HotelsPage = lazy(() => import("./pages/HotelsPage"));
const HotelDetailPage = lazy(() => import("./pages/HotelDetailPage"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// *** PERIKSA LOKASI FILE INI ***
// Jika file admin ada di src/components/Admin:
const ManageHotelsPage = lazy(
  () => import("./components/Admin/ManageHotelsPage")
);
const ManageUsersPage = lazy(
  () => import("./components/Admin/ManageUsersPage")
);
const ManageBookingsPage = lazy(
  () => import("./components/Admin/ManageBookingsPage")
); // <- Path ini mungkin perlu diubah ke components/Admin

// Jika file admin ada di src/pages/Admin:
// const ManageHotelsPage = lazy(() => import("./pages/Admin/ManageHotelsPage"));
// const ManageUsersPage = lazy(() => import("./pages/Admin/ManageUsersPage"));
// const ManageBookingsPage = lazy(() => import("./pages/Admin/ManageBookingsPage"));

interface ProtectedRouteProps {
  allowedRoles?: Array<"user" | "admin">;
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <div className="loader"></div>;
  if (!isAuthenticated)
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-content container">
        <Suspense fallback={<div className="loader"></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                path="/admin/manage-hotels"
                element={<ManageHotelsPage />}
              />
              <Route path="/admin/manage-users" element={<ManageUsersPage />} />
              <Route
                path="/admin/manage-bookings"
                element={<ManageBookingsPage />}
              />
            </Route>

            {/* PERBAIKAN: Pastikan tidak ada komentar kosong di dalam element={} */}
            <Route
              path="/unauthorized"
              element={
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "50px",
                    padding: "20px",
                  }}
                >
                  <h1
                    style={{ fontSize: "2.5rem", color: "var(--danger-color)" }}
                  >
                    403 - Unauthorized Access
                  </h1>
                  <p
                    style={{
                      fontSize: "1.1rem",
                      color: "var(--dark-gray-color)",
                      marginTop: "15px",
                    }}
                  >
                    You do not have the necessary permissions to view this page.
                  </p>
                  <Link to="/" className="button primary mt-3">
                    Go to Homepage
                  </Link>
                </div>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
