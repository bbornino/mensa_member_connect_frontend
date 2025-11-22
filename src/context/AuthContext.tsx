// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { API_BASE_URL, TOKEN_REFRESH_API_URL } from "../utils/constants";

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [isLoading, setIsLoading] = useState(true);
  
  // Track if token refresh is in progress to prevent multiple simultaneous refreshes
  const isRefreshing = useRef(false);
  const refreshPromise = useRef<Promise<string> | null>(null);

  // Use refs to store latest function references for interceptors
  const clearAuthStateRef = useRef<(() => void) | null>(null);
  const refreshAccessTokenInternalRef = useRef<(() => Promise<string | null>) | null>(null);

  // Centralized function to clear auth state
  const clearAuthState = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setAccessToken(null);
  }, []);

  // Centralized token refresh function that prevents concurrent refreshes
  const refreshAccessTokenInternal = useCallback(async (): Promise<string | null> => {
    // If already refreshing, return the existing promise
    if (isRefreshing.current && refreshPromise.current) {
      return refreshPromise.current;
    }

    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      return null;
    }

    isRefreshing.current = true;
    refreshPromise.current = (async () => {
      try {
        const response = await axios.post(TOKEN_REFRESH_API_URL, { refresh });
        const { access } = response.data;
        localStorage.setItem("access_token", access);
        setAccessToken(access);
        return access;
      } catch (err) {
        console.error("Token refresh failed:", err);
        clearAuthStateRef.current?.();
        throw err;
      } finally {
        isRefreshing.current = false;
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  }, [clearAuthState]);

  // Update refs when functions change
  useEffect(() => {
    clearAuthStateRef.current = clearAuthState;
    refreshAccessTokenInternalRef.current = refreshAccessTokenInternal;
  }, [clearAuthState, refreshAccessTokenInternal]);

  // Setup axios interceptors for automatic token refresh
  useEffect(() => {
    // Request interceptor: Add token to requests
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle 401 and refresh token
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessTokenInternalRef.current?.();
            if (newToken) {
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear auth state
            clearAuthStateRef.current?.();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");
      
      if (!storedToken || !storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate token by fetching current user data from API
        // This ensures token is valid and gets latest user data
        const response = await apiClient.get("users/me/");
        const userData = response.data;
        
        // Token is valid, update user data from API (more reliable than localStorage)
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setAccessToken(storedToken);
      } catch (error: any) {
        // Token validation failed - clear auth state
        // Interceptor will have already tried to refresh if it was a 401
        console.error("Token validation failed during init:", error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}users/authenticate/`, 
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access, refresh, user } = response.data;

      // Store tokens and user data
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setAccessToken(access);
      setUser(user);

      return { success: true };
    } catch (err: any) {
      console.error("Login failed:", err);
      
      // Extract error message from response
      let errorMessage = "Failed to sign in. Please try again.";
      if (err.response?.data) {
        const errorData = err.response.data;
        errorMessage = errorData.error || errorData.detail || errorData.message || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const refreshAccessToken = async (): Promise<void> => {
    try {
      await refreshAccessTokenInternal();
    } catch (err) {
      // Error already handled in refreshAccessTokenInternal
      throw err;
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    try {
      if (refresh && accessToken) {
        await apiClient.post("users/logout/", { refresh });
      }
    } catch (error) {
      // Continue with local logout even if backend logout fails
      console.warn("Backend logout failed (continuing local logout):", error);
    } finally {
      clearAuthState();
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
