// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react"; // TYPE ONLY
import type { User } from "../types"; // TYPE ONLY
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginContext: (token: string, userData: User) => void;
  logoutContext: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface DecodedToken {
  sub: string;
  username: string;
  role: "user" | "admin";
  exp: number;
  iat: number;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const performLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const checkTokenValidity = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            id: decodedToken.sub,
            username: decodedToken.username,
            role: decodedToken.role,
          });
          setToken(storedToken);
        } else {
          console.log("Token expired, logging out.");
          performLogout();
        }
      } catch (error) {
        console.error("Invalid token:", error);
        performLogout();
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setIsLoading(false);
  }, [performLogout]);

  useEffect(() => {
    checkTokenValidity();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        checkTokenValidity();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkTokenValidity]);

  const loginContext = (newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logoutContext = () => {
    performLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginContext,
        logoutContext,
        isLoading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
