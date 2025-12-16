

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useRole } from "../hooks/useRole"

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated } = useAuth()
  const { role } = useRole()

  if (!isAuthenticated) {
    console.log("User is not authenticated. Redirecting to login page.")
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
