// useApiRequest.ts
import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { customFetch } from './customFetch';

export function useApiRequest<T = any>() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  const apiRequest = useCallback(
    async (url: string, body: Record<string, any> = {}, options: RequestInit = {}): Promise<T | null> => {
      try {
        const response: T = await customFetch(url, { ...options, body }, accessToken, refreshToken, navigate);
        return response;
      } catch (err: any) {
        setError(err?.message ?? 'Unknown error');
        console.error(err);
        return null;
      }
    },
    [navigate, accessToken, refreshToken]
  );

  return { apiRequest, error };
}
