import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: !!localStorage.getItem("access_token"),
  accessToken: localStorage.getItem("access_token"),
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
      state.loading = false
      state.error = null
      localStorage.setItem("access_token", action.payload.accessToken)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.accessToken = null
      state.error = null
      localStorage.removeItem("access_token")
    },
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken
      localStorage.setItem("access_token", action.payload.accessToken)
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, refreshTokenSuccess } = authSlice.actions
export default authSlice.reducer
