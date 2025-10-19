// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { API_BASE_URL, TOKEN_REFRESH_API_URL } from "../utils/constants";

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken && storedUser) {
        try {
          // Parse stored user data
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setAccessToken(storedToken);
        } catch (err) {
          console.error("Failed to parse stored user:", err);
          // Clear invalid data
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}users/authenticate/`, 
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );


      const { access, refresh, user } = response.data;

      // Store tokens and user data
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

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

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    try {
      if (refresh) {
        await axios.post(
          `${API_BASE_URL}users/logout/`,
          { refresh },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // <-- correctly nested
            },
          }
        );
      }
    } catch (error) {
      console.warn("Backend logout failed (continuing local logout):", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      setAccessToken(null);
      setUser(null);
    }
  };


  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, refreshAccessToken, isLoading }}
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
