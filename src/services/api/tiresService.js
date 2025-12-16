import axiosInstance from "./axiosInstance"

export const tiresService = {
  getAll: (params) => axiosInstance.get("/tires", { params }),
  getById: (id) => axiosInstance.get(`/tires/${id}`),
  create: (data) => axiosInstance.post("/tires", data),
  update: (id, data) => axiosInstance.put(`/tires/${id}`, data),
  delete: (id) => axiosInstance.delete(`/tires/${id}`),
  assignToVehicle: (id, vehicleData) => axiosInstance.post(`/tires/${id}/assign`, vehicleData),
}
