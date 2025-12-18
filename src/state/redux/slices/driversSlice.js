import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  drivers: [],
  selectedDriver: null,
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

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    setDrivers: (state, action) => {
      state.drivers = action.payload
    },
    addDriver: (state, action) => {
      state.drivers.unshift(action.payload)
    },
    updateDriver: (state, action) => {
      const index = state.drivers.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.drivers[index] = action.payload
      }
    },
    deleteDriver: (state, action) => {
      state.drivers = state.drivers.filter((d) => d.id !== action.payload)
    },
    setSelectedDriver: (state, action) => {
      state.selectedDriver = action.payload
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
  setDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  setSelectedDriver,
  setLoading,
  setError,
  setPagination,
  setFilters,
} = driversSlice.actions
export default driversSlice.reducer
