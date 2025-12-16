

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import ProtectedRoute from "./components/ProtectedRoute"
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import TrucksPage from "./pages/TrucksPage"
import TrailersPage from "./pages/TrailersPage"
import TiresPage from "./pages/TiresPage"
import DriversPage from "./pages/DriversPage"
import TripsPage from "./pages/TripsPage"
import FuelRecordsPage from "./pages/FuelRecordsPage"
import MaintenancePage from "./pages/MaintenancePage"
import AlertsPage from "./pages/AlertsPage"
import MissionOrdersPage from "./pages/MissionOrdersPage"
import SettingsPage from "./pages/SettingsPage"

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      </Route>

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trucks" element={<TrucksPage />} />
        <Route path="/trailers" element={<TrailersPage />} />
        <Route path="/tires" element={<TiresPage />} />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute requiredRole="Admin">
              <DriversPage />
            </ProtectedRoute>
          }
        />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/fuel-records" element={<FuelRecordsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/mission-orders" element={<MissionOrdersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
