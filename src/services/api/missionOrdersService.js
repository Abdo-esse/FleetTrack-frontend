import axiosInstance from "./axiosInstance"

export const missionOrdersService = {
  getAll: (params) => axiosInstance.get("/mission-orders", { params }),
  getById: (id) => axiosInstance.get(`/mission-orders/${id}`),
  generate: (tripId) => axiosInstance.post(`/mission-orders/generate/${tripId}`, {}, { responseType: "blob" }),
}
