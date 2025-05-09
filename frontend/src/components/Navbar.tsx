// frontend/src/components/Navbar.tsx
import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const { user, logoutContext } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutContext();
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navContainer} container`}>
        <Link to="/" className={styles.brand}>
          HotelBooking
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/hotels" className={getNavLinkClass}>
              Hotels
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to="/my-bookings" className={getNavLinkClass}>
                  My Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={getNavLinkClass}>
                  Profile
                </NavLink>
              </li>
              {user.role === "admin" && (
                <>
                  <li>
                    <NavLink
                      to="/admin/manage-hotels"
                      className={getNavLinkClass}
                    >
                      Manage Hotels
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/manage-users"
                      className={getNavLinkClass}
                    >
                      Manage Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/manage-bookings"
                      className={getNavLinkClass}
                    >
                      Manage Bookings
                    </NavLink>
                  </li>{" "}
                  {/* <-- Link Admin Booking */}
                </>
              )}
              <li className={styles.userInfo}>Hi, {user.username}</li>
              <li>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={getNavLinkClass}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={getNavLinkClass}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
