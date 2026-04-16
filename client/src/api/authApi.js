import axiosInstance from "./axiosInstance";

export const authApi = {
  register(payload) {
    return axiosInstance.post("/auth/register", payload);
  },
  login(payload) {
    return axiosInstance.post("/auth/login", payload);
  },
  refresh(token) {
    return axiosInstance.post("/auth/refresh", { token });
  },
};
