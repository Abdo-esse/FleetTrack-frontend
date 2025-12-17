import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  trucks: [],
  selectedTruck: null,
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

const trucksSlice = createSlice({
  name: "trucks",
  initialState,
  reducers: {
    setTrucks: (state, action) => {
      state.trucks = action.payload
      console.log("Trucks state updated:", state.trucks)
    },
    addTruck: (state, action) => {
      state.trucks.unshift(action.payload)
    },
    updateTruck: (state, action) => {
      const index = state.trucks.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.trucks[index] = action.payload
      }
    },
    deleteTruck: (state, action) => {
      state.trucks = state.trucks.filter((t) => t._id !== action.payload)
    },
    setSelectedTruck: (state, action) => {
      state.selectedTruck = action.payload
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
  setTrucks,
  addTruck,
  updateTruck,
  deleteTruck,
  setSelectedTruck,
  setLoading,
  setError,
  setPagination,
  setFilters,
} = trucksSlice.actions
export default trucksSlice.reducer
