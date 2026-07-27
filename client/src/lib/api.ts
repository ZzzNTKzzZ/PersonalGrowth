import { Platform } from "react-native";

// Địa chỉ IP mặc định tương thích theo nền tảng
// - Android Emulator: 10.0.2.2
// - iOS / Web: localhost
const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
};

export const API_BASE_URL = getBaseUrl();

let tokenStorage: string | null = null;

export const setAuthToken = (token: string | null) => {
  tokenStorage = token;
};

export const getAuthToken = () => tokenStorage;

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (tokenStorage) {
    headers["Authorization"] = `Bearer ${tokenStorage}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    console.error(`[API Request Error] ${url}:`, error.message || error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) => {
    let queryString = "";
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, val);
        }
      });
      const query = searchParams.toString();
      if (query) queryString = `?${query}`;
    }
    return request<T>(`${endpoint}${queryString}`, { method: "GET" });
  },

  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "DELETE",
    }),
};
