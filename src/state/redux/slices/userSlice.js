import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  profile: null,
  role: localStorage.getItem("user_role") || null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload.profile
      state.role = action.payload.role
      localStorage.setItem("user_role", action.payload.role)
    },
    updateUser: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    clearUser: (state) => {
      state.profile = null
      state.role = null
      localStorage.removeItem("user_role")
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setUser, updateUser, clearUser, setLoading, setError } = userSlice.actions
export default userSlice.reducer
