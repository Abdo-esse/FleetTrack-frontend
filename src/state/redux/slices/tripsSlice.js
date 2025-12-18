import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  trips: [],
  selectedTrip: null,
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

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    setTrips: (state, action) => {
      state.trips = action.payload
    },
    addTrip: (state, action) => {
      state.trips.unshift(action.payload)
    },
    updateTrip: (state, action) => {
      const index = state.trips.findIndex((t) => t._id === action.payload._id)
      if (index !== -1) {
        state.trips[index] = action.payload
      }
    },
    deleteTrip: (state, action) => {
      state.trips = state.trips.filter((t) => t._id !== action.payload)
    },
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload
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
  setTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  setSelectedTrip,
  setLoading,
  setError,
  setPagination,
  setFilters,
} = tripsSlice.actions
export default tripsSlice.reducer
