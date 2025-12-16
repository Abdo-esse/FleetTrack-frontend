import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: !!localStorage.getItem("access_token"),
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.loading = false
      state.error = null
      localStorage.setItem("access_token", action.payload.accessToken)
      localStorage.setItem("refresh_token", action.payload.refreshToken)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.accessToken = null
      state.refreshToken = null
      state.error = null
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    },
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken
      localStorage.setItem("access_token", action.payload.accessToken)
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, refreshTokenSuccess } = authSlice.actions
export default authSlice.reducer
