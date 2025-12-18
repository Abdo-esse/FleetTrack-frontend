import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  rules: [],
  records: [],
  selectedRule: null,
  selectedRecord: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
}

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    setRules: (state, action) => {
      state.rules = action.payload
    },
    addRule: (state, action) => {
      state.rules.unshift(action.payload)
    },
    updateRule: (state, action) => {
      const index = state.rules.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.rules[index] = action.payload
      }
    },
    deleteRule: (state, action) => {
      state.rules = state.rules.filter((r) => r.id !== action.payload)
    },
    setRecords: (state, action) => {
      state.records = action.payload
    },
    addRecord: (state, action) => {
      state.records.unshift(action.payload)
    },
    updateRecord: (state, action) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.records[index] = action.payload
      }
    },
    deleteRecord: (state, action) => {
      state.records = state.records.filter((r) => r._id !== action.payload)
    },
    setSelectedRule: (state, action) => {
      state.selectedRule = action.payload
    },
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload
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
  },
})

export const {
  setRules,
  addRule,
  updateRule,
  deleteRule,
  setRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  setSelectedRule,
  setSelectedRecord,
  setLoading,
  setError,
  setPagination,
} = maintenanceSlice.actions
export default maintenanceSlice.reducer
