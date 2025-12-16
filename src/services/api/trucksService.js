import axiosInstance from "./axiosInstance"

export const trucksService = {
  getAll: (params) => axiosInstance.get("/trucks", { params }),
  getById: (id) => axiosInstance.get(`/trucks/${id}`),
  create: (data) => axiosInstance.post("/trucks", data),
  update: (id, data) => axiosInstance.put(`/trucks/${id}`, data),
  delete: (id) => axiosInstance.delete(`/trucks/${id}`),
}
