import { Platform } from "react-native";
import axios, { AxiosError, InternalAxiosRequestConfig} from 'axios'
import * as SecureStore from "expo-secure-store"

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_API_URL;

  }
  return "http://localhost:3000";
};

export const API_BASE_URL = getBaseUrl();

let tokenStorage: string | null = null;

export const setAuthToken = (token: string | null) => {
  tokenStorage = token;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": 'application/json'
  }
})

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error("Lỗi khi đọc token từ SecureStore: ", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reson?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry? : boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if(isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return apiClient(originalRequest)
        })
        .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token')
        if (!refreshToken) {
          throw new Error('Không có refresh token')
        }
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const newToken = res.data
        const newAccessToken = newToken.accessToken

        await SecureStore.setItemAsync('access_token', newAccessToken)
        if (newToken.refreshToken) {
          await SecureStore.setItemAsync('refresh_token', newToken.refreshToken)
        }

        processQueue(null, newAccessToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null )

        await SecureStore.deleteItemAsync('access_token')
        await SecureStore.deleteItemAsync('refresh_token')
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error.response?.data)
  }
)
 export const api = {
      get: <T>(url: string, params?: Record<string, any>) =>
        apiClient.get<any, T>(url, { params }),
      post: <T>(url: string, data?: any) =>
        apiClient.post<any, T>(url, data),
      patch: <T>(url: string, data?: any) =>
        apiClient.patch<any, T>(url, data),
      delete: <T>(url: string) =>
        apiClient.delete<any, T>(url),
    };