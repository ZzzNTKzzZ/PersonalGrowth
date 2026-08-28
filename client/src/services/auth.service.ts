import { api, setAuthToken } from "@/lib/api";
import * as SecureStore from "expo-secure-store";

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const authService = {
  saveTokens: async (tokens: AuthTokens) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  register: async (dto: RegisterDto) => {
    const res = await api.post<any>("/auth/register", dto);
    const tokens = (res?.data || res) as AuthTokens;
    if (tokens?.accessToken) {
      await authService.saveTokens(tokens);
    }
    return tokens;
  },

  login: async (dto: LoginDto) => {
    const res = await api.post<any>("/auth/login", dto);
    const tokens = (res?.data || res) as AuthTokens;
    if (tokens?.accessToken) {
      await authService.saveTokens(tokens);
    }
    return tokens;
  },

  getAccessToken: async () => {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  // 5. Đăng xuất & Xóa Token
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.log("Logout backend fallback");
    }
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setAuthToken(null);
  },
};
