import axiosInstance from "./axiosInstance"

export const fuelRecordsService = {
  getAll: (params) => axiosInstance.get("/fuel-records", { params }),
  getById: (id) => axiosInstance.get(`/fuel-records/${id}`),
  create: (data) => axiosInstance.post("/fuel-records", data),
  update: (id, data) => axiosInstance.put(`/fuel-records/${id}`, data),
  delete: (id) => axiosInstance.delete(`/fuel-records/${id}`),
}
