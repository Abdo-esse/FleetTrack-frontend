import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  tires: [],
  selectedTire: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  filters: {
    search: "",
    wearLevel: "all",
  },
}

const tiresSlice = createSlice({
  name: "tires",
  initialState,
  reducers: {
    setTires: (state, action) => {
      state.tires = action.payload
    },
    addTire: (state, action) => {
      state.tires.unshift(action.payload)
    },
    updateTire: (state, action) => {
      const index = state.tires.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.tires[index] = action.payload
      }
    },
    deleteTire: (state, action) => {
      state.tires = state.tires.filter((t) => t._id !== action.payload)
    },
    setSelectedTire: (state, action) => {
      state.selectedTire = action.payload
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
  setTires,
  addTire,
  updateTire,
  deleteTire,
  setSelectedTire,
  setLoading,
  setError,
  setPagination,
  setFilters,
} = tiresSlice.actions
export default tiresSlice.reducer
