import axiosInstance from "./axiosInstance"

export const tripsService = {
  getAll: (params) => axiosInstance.get("/trips", { params }),
  getById: (id) => axiosInstance.get(`/trips/${id}`),
  create: (data) => axiosInstance.post("/trips", data),
  update: (id, data) => axiosInstance.put(`/trips/${id}`, data),
  delete: (id) => axiosInstance.delete(`/trips/${id}`),
  startTrip: (id, data) => axiosInstance.post(`/trips/${id}/start`, data),
  completeTrip: (id, data) => axiosInstance.post(`/trips/${id}/complete`, data),
}
