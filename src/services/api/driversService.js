import axiosInstance from "./axiosInstance"

export const driversService = {
  getAll: (params) => axiosInstance.get("/drivers", { params }),
  getById: (id) => axiosInstance.get(`/drivers/${id}`),
  create: (data) => axiosInstance.post("/drivers", data),
  update: (id, data) => axiosInstance.put(`/drivers/${id}`, data),
  delete: (id) => axiosInstance.delete(`/drivers/${id}`),
}
