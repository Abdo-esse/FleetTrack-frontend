import axiosInstance from "./axiosInstance"

export const trailersService = {
  getAll: (params) => axiosInstance.get("/trailers", { params }),
  getById: (id) => axiosInstance.get(`/trailers/${id}`),
  create: (data) => axiosInstance.post("/trailers", data),
  update: (id, data) => axiosInstance.put(`/trailers/${id}`, data),
  delete: (id) => axiosInstance.delete(`/trailers/${id}`),
}
