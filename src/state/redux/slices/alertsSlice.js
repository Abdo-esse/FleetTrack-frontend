import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  alerts: [],
  selectedAlert: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    type: "all",
    status: "all",
  },
}

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts: (state, action) => {
      state.alerts = action.payload
    },
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload)
    },
    updateAlert: (state, action) => {
      const index = state.alerts.findIndex((a) => a.id === action.payload.id)
      if (index !== -1) {
        state.alerts[index] = action.payload
      }
    },
    deleteAlert: (state, action) => {
      state.alerts = state.alerts.filter((a) => a._id !== action.payload)
    },
    resolveAlert: (state, action) => {
      const index = state.alerts.findIndex((a) => a._id === action.payload)
      if (index !== -1) {
        state.alerts[index].status = "resolved"
      }
    },
    setSelectedAlert: (state, action) => {
      state.selectedAlert = action.payload
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
  setAlerts,
  addAlert,
  updateAlert,
  deleteAlert,
  resolveAlert,
  setSelectedAlert,
  setLoading,
  setError,
  setPagination,
  setFilters,
} = alertsSlice.actions
export default alertsSlice.reducer
