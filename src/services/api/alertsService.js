import axiosInstance from "./axiosInstance"

export const alertsService = {
  getAll: (params) => axiosInstance.get("/maintenance/alerts", { params }),
  getById: (id) => axiosInstance.get(`/maintenance/alerts/${id}`),
  resolve: (id) => axiosInstance.patch(`/maintenance/alerts/${id}/resolve`),
  delete: (id) => axiosInstance.delete(`/maintenance/alerts/${id}`),
}
