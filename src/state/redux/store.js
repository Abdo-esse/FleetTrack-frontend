import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import userReducer from "./slices/userSlice"
import trucksReducer from "./slices/trucksSlice"
import trailersReducer from "./slices/trailersSlice"
import tiresReducer from "./slices/tiresSlice"
import driversReducer from "./slices/driversSlice"
import tripsReducer from "./slices/tripsSlice"
import fuelRecordsReducer from "./slices/fuelRecordsSlice"
import maintenanceReducer from "./slices/maintenanceSlice"
import alertsReducer from "./slices/alertsSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    trucks: trucksReducer,
    trailers: trailersReducer,
    tires: tiresReducer,
    drivers: driversReducer,
    trips: tripsReducer,
    fuelRecords: fuelRecordsReducer,
    maintenance: maintenanceReducer,
    alerts: alertsReducer,
  },
})
