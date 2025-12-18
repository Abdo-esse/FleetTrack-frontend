import axiosInstance from "./axiosInstance"

export const tripsService = {
  getAll: (params) => axiosInstance.get("/trips", { params }),
  getById: (id) => axiosInstance.get(`/trips/${id}`),
  create: (data) => axiosInstance.post("/trips", data),
  update: (id, data) => axiosInstance.put(`/trips/${id}`, data),
  delete: (id) => axiosInstance.delete(`/trips/${id}`),
  startTrip: (id, data) => axiosInstance.patch(`/trips/${id}/status`, data),
  completeTrip: (id, data) => axiosInstance.patch(`/trips/${id}/complete`, data),
  assignDriver: (id, data) => axiosInstance.patch(`/trips/${id}/assign-driver`, data),
  telechargeMissionOrder: (id) =>
    axiosInstance.get(
      `/trips/${id}/telecharge-mission-order`,
      {
        responseType: 'blob',
      }
    ),

}
