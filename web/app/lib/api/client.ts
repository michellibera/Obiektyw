// Bazowy klient API z retry i timeout

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface FetchOptions extends Omit<RequestInit, 'signal'> {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function apiClient<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: timeout > 0 ? controller.signal : undefined,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          errorData?.error || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        // Don't retry client errors
        throw error;
      }

      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt < retries - 1) {
        await sleep(retryDelay * Math.pow(2, attempt));
      }
    }
  }

  throw lastError || new Error('Request failed');
}

// Helper dla POST requests
export async function postJson<T>(
  url: string,
  data: unknown,
  options: FetchOptions = {}
): Promise<T> {
  return apiClient<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

// Helper dla GET requests
export async function getJson<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>,
  options: FetchOptions = {}
): Promise<T> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return apiClient<T>(fullUrl, {
    method: 'GET',
    ...options,
  });
}
