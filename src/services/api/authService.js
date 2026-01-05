import axiosInstance from "./axiosInstance"

export const authService = {
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (userData) => axiosInstance.post("/auth/register", userData),
  logout: () => axiosInstance.post("/auth/logout"),
  refreshToken: (refreshToken) => axiosInstance.post("/auth/refresh",),
  getCurrentUser: () => axiosInstance.get("/auth/me"),
  updateProfile: (userData) => axiosInstance.put("/auth/profile", userData),
  changePassword: (passwords) => axiosInstance.post("/auth/change-password", passwords),
}
