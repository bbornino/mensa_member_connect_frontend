import { TOKEN_REFRESH_API_URL, API_BASE_URL } from "./constants";


interface FetchOptions extends RequestInit {
  body?: any; // Can later type more strictly
}

export async function customFetch(
  endpoint: string,
  options: FetchOptions = {},
  accessToken: string | null,
  refreshToken: string | null,
  navigate: (path: string) => void
): Promise<any> {  // Could refine the return type later
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  let isRefreshing = false;
  let refreshPromise: Promise<string> | null = null;

  try {
    async function refreshAccessToken(): Promise<string> {
      const response = await fetch(TOKEN_REFRESH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        navigate('/login');
        throw new Error('Failed to refresh access token');
      }

      const data: { access: string } = await response.json();
      return data.access;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
    const body = methodsWithBody.includes(options.method || '') 
      ? JSON.stringify(options.body) 
      : undefined;

    let response = await fetch(url, {
      ...options,
      headers,
      body,
    });

    if (response.status === 401 && refreshToken && !isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
      const newAccessToken = await refreshPromise;
      localStorage.setItem('access_token', newAccessToken);

      const retryHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newAccessToken}`,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const retryData = await response.json();
      return retryData || [];
    }

    if (!response.ok && response.status !== 401) {
      console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return text.trim().length === 0 ? [] : [];
    }

    const data = await response.json();

    if (options.method === 'PATCH') {
      return { status: response.status, data };
    }

    return data || [];
  } catch (error) {
    console.error('Custom fetch error:', error);
    return [];
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}
