import axiosInstance from "./axiosInstance";

export const userApi = {
  list(params) {
    return axiosInstance.get("/users", { params });
  },
  getById(id) {
    return axiosInstance.get(`/users/${id}`);
  },
  create(payload) {
    return axiosInstance.post("/users", payload);
  },
  update(id, payload) {
    return axiosInstance.put(`/users/${id}`, payload);
  },
  toggleStatus(id, payload) {
    return axiosInstance.put(`/users/${id}`, payload);
  },
  deactivate(id) {
    return axiosInstance.delete(`/users/${id}`);
  },
  getProfile() {
    return axiosInstance.get("/users/me");
  },
  updateProfile(payload) {
    return axiosInstance.put("/users/me", payload);
  },
};
