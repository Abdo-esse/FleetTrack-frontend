import axios from "axios"
import { store } from "../../state/redux/store"
import { refreshTokenSuccess, logout } from "../../state/redux/slices/authSlice"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const accessToken = state.auth.accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const response = await axiosInstance.post("/auth/refresh")

        const newAccessToken = response.data.accessToken

        store.dispatch(
          refreshTokenSuccess({ accessToken: newAccessToken })
        )

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        store.dispatch(logout())
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
