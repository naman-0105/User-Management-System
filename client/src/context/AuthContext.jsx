import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import { authStorage } from "../utils/storage";
import { registerUnauthorizedHandler } from "../api/axiosInstance";
import AuthContext from "./authContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authStorage.getUser());
  const [loading, setLoading] = useState(true);

  const logout = (showToast = false) => {
    authStorage.clearSession();
    setUser(null);
    if (showToast) {
      toast.error("Session expired. Please log in again.");
    }
  };

  useEffect(() => {
    registerUnauthorizedHandler(() => logout(true));

    const bootstrap = async () => {
      const accessToken = authStorage.getAccessToken();
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await userApi.getProfile();
        const profile = response.data.data;
        setUser(profile);
        authStorage.setSession({
          accessToken,
          refreshToken: authStorage.getRefreshToken(),
          user: profile,
        });
      } catch {
        const refreshToken = authStorage.getRefreshToken();
        if (!refreshToken) {
          logout(false);
          setLoading(false);
          return;
        }
        try {
          const refreshResponse = await authApi.refresh(refreshToken);
          const newToken = refreshResponse.data.data.accessToken;
          const profileResponse = await userApi.getProfile();
          const profile = profileResponse.data.data;
          authStorage.setSession({
            accessToken: newToken,
            refreshToken,
            user: profile,
          });
          setUser(profile);
        } catch {
          logout(false);
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const response = await authApi.login(payload);
    const { accessToken, refreshToken, user: authenticatedUser } = response.data.data;
    authStorage.setSession({ accessToken, refreshToken, user: authenticatedUser });
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = async (payload) => {
    return authApi.register(payload);
  };

  const refreshProfile = async () => {
    const response = await userApi.getProfile();
    setUser(response.data.data);
    authStorage.setSession({
      accessToken: authStorage.getAccessToken(),
      refreshToken: authStorage.getRefreshToken(),
      user: response.data.data,
    });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
