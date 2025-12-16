import axiosInstance from "./axiosInstance"

export const maintenanceService = {
  getRules: (params) => axiosInstance.get("/maintenance/rules", { params }),
  createRule: (data) => axiosInstance.post("/maintenance/rules", data),
  updateRule: (id, data) => axiosInstance.put(`/maintenance/rules/${id}`, data),
  deleteRule: (id) => axiosInstance.delete(`/maintenance/rules/${id}`),
  getRecords: (params) => axiosInstance.get("/maintenance/records", { params }),
  createRecord: (data) => axiosInstance.post("/maintenance/records", data),
  updateRecord: (id, data) => axiosInstance.put(`/maintenance/records/${id}`, data),
  deleteRecord: (id) => axiosInstance.delete(`/maintenance/records/${id}`),
}
