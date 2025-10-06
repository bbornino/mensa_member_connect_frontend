// src/context/AuthContext.tsx
import { createContext, useContext, useState} from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { API_BASE_URL, TOKEN_REFRESH_API_URL } from "../utils/constants";

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      // TEMP: store both for now
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setAccessToken(access);
      setUser(user);

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const refreshAccessToken = async (): Promise<void> => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) throw new Error("No refresh token found");

      const response = await axios.post(TOKEN_REFRESH_API_URL, { refresh });
      const { access } = response.data;

      localStorage.setItem("access_token", access);
      setAccessToken(access);
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
