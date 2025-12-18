import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  fuelRecords: [],
  selectedFuelRecord: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    search: "",
    tripId: null,
  },
}

const fuelRecordsSlice = createSlice({
  name: "fuelRecords",
  initialState,
  reducers: {
    setFuelRecords: (state, action) => {
      state.fuelRecords = action.payload
    },
    addFuelRecord: (state, action) => {
      state.fuelRecords.unshift(action.payload)
    },
    updateFuelRecord: (state, action) => {
      const index = state.fuelRecords.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) {
        state.fuelRecords[index] = action.payload
      }
    },
    deleteFuelRecord: (state, action) => {
      state.fuelRecords = state.fuelRecords.filter((f) => f.id !== action.payload)
    },
    setSelectedFuelRecord: (state, action) => {
      state.selectedFuelRecord = action.payload
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
  setFuelRecords,
  addFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
  setSelectedFuelRecord,
  setLoading,
  setError,
  setPagination,
  setFilters,
} = fuelRecordsSlice.actions
export default fuelRecordsSlice.reducer
