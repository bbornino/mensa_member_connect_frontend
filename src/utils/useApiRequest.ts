// useApiRequest.ts
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { customFetch } from "./customFetch";

export function useApiRequest<T = any>() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const apiRequest = useCallback(
    async (url: string, options: RequestInit = {}): Promise<T | null> => {
      try {
        const response: T = await customFetch(
          url,
          options,
          accessToken,
          refreshToken,
          navigate
        );
        return response;
      } catch (err: any) {
        setError(err?.message ?? "Unknown error");
        console.error(err);
        // Re-throw the error so it can be caught and handled by the caller
        throw err;
      }
    },
    [navigate, accessToken, refreshToken]
  );

  return { apiRequest, error };
}
