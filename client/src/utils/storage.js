import { STORAGE_KEYS } from "../constants/appConstants";

export const authStorage = {
  setSession({ accessToken, refreshToken, user }) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken || "");
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken || "");
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user || null));
  },
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || "";
  },
  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || "";
  },
  getUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },
};
