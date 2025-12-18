import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  trailers: [],
  selectedTrailer: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    search: "",
    status: "all",
  },
}

const trailersSlice = createSlice({
  name: "trailers",
  initialState,
  reducers: {
    setTrailers: (state, action) => {
      state.trailers = action.payload
    },
    addTrailer: (state, action) => {
      state.trailers.unshift(action.payload)
    },
    updateTrailer: (state, action) => {
      const index = state.trailers.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.trailers[index] = action.payload
      }
    },
    deleteTrailer: (state, action) => {
      state.trailers = state.trailers.filter((t) => t._id !== action.payload)
    },
    setSelectedTrailer: (state, action) => {
      state.selectedTrailer = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const {
  setTrailers,
  addTrailer,
  updateTrailer,
  deleteTrailer,
  setSelectedTrailer,
  setLoading,
  setError,
  setPagination,
  setFilters,
} = trailersSlice.actions
export default trailersSlice.reducer
