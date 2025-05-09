// frontend/src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthForm from "../components/AuthForm"; // VERIFIKASI PATH
import { login as loginService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import type { LoginDto } from "../types"; // TYPE ONLY
// Hapus ApiErrorDetail & AxiosError jika tidak dipakai langsung
import { getApiErrorMessage } from "../utils/errorUtils";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginContext, isAuthenticated, isLoading: authLoading } = useAuth();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log(`Already authenticated, redirecting to: ${from}`);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleLogin = async (credentials: LoginDto) => {
    setLoading(true);
    setError(null);
    try {
      const authResponse = await loginService(credentials);
      loginContext(authResponse.access_token, authResponse.user);
      console.log(`Login successful, navigating to: ${from}`);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        getApiErrorMessage(err, "Login failed. Please check your credentials.")
      );
      console.error("Login error:", err);
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
        formType="login"
        onSubmit={handleLogin}
        loading={loading}
        serverError={error}
      />
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
