import axiosInstance from "./axiosInstance"

export const alertsService = {
  getAll: (params) => axiosInstance.get("/alerts", { params }),
  getById: (id) => axiosInstance.get(`/alerts/${id}`),
  resolve: (id) => axiosInstance.post(`/alerts/${id}/resolve`),
  delete: (id) => axiosInstance.delete(`/alerts/${id}`),
}
