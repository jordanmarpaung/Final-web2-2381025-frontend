// frontend/src/pages/RegisterPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/AuthForm"; // Path ini sekarang seharusnya valid
import { register as registerService } from "../services/authService";
import type { RegisterDto } from "../types"; // TYPE ONLY, Hapus ApiErrorDetail
// Hapus AxiosError
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/errorUtils";

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleRegister = async (userData: RegisterDto) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await registerService(userData);
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      setError(
        getApiErrorMessage(err, "Registration failed. Please try again.")
      );
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="loader mt-5"></div>;
  }
  if (isAuthenticated) {
    return null;
  }

  return (
    <div>
      <AuthForm
        formType="register"
        onSubmit={handleRegister}
        loading={loading}
        serverError={error}
        successMessage={successMessage}
      />
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
