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
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    };

    const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];

    let body: string | FormData | undefined;
    if (methodsWithBody.includes(options.method || '')) {
      if (options.body instanceof FormData) {
        // FormData should be sent as-is
        body = options.body;
        // Do NOT manually set Content-Type for FormData
      } else if (typeof options.body === 'string') {
        body = options.body; // already JSON stringified by caller
      } else {
        body = JSON.stringify(options.body); // convert object to JSON
      }
    } else {
      body = undefined;
    }


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
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
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
      
      // Try to get error details from response
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        // Log each field's errors for debugging
        Object.entries(errorData).forEach(([field, errors]: [string, any]) => {
          console.error(`Field "${field}" errors:`, errors);
        });
        // Throw error with details so it can be caught and handled
        const error = new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
      } else {
        const text = await response.text();
        const error = new Error(`HTTP Error: ${response.status} - ${response.statusText}: ${text}`);
        (error as any).status = response.status;
        throw error;
      }
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
  } catch (error: any) {
    // If error already has status/data, re-throw it (it's an HTTP error we want to propagate)
    if (error.status) {
      throw error;
    }
    // Otherwise, it's a network/other error
    console.error('Custom fetch error:', error);
    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}
