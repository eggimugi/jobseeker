  export const API_BASE = "http://localhost:8080";

  export const apiRequest = async (
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ) => {
    const headers: Record<string, string> = {};
    
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add existing headers if any
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    

    if (!response.ok) {
      const error = new Error(
        `HTTP error! status: ${response.status}`
      ) as Error & { status: number; body: unknown };
      error.status = response.status;
      try {
        error.body = await response.json();
      } catch {
        error.body = null;
      }
      throw error;
    }

    return response.json();
  };
