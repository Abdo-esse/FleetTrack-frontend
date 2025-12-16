import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from "../state/redux/slices/authSlice"
import { setUser, clearUser } from "../state/redux/slices/userSlice"
import { authService } from "../services/api/authService"

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, accessToken, refreshToken, loading, error } = useSelector((state) => state.auth)
  const { profile, role } = useSelector((state) => state.user)

  const login = async (credentials) => {
    try {
      console.log("Logging in with credentials:", credentials)
      dispatch(loginStart())
      const response = await authService.login(credentials)
      console.log("Login response:", response)

      dispatch(
        loginSuccess({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        }),
      )

      dispatch(
        setUser({
          profile: response.data.user,
          role: response.data.user.role,
        }),
      )

      navigate("/dashboard")
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Login failed"))
      throw err
    }
  }

  const register = async (userData) => {
    try {
      dispatch(loginStart())
      const response = await authService.register(userData)

      dispatch(
        loginSuccess({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        }),
      )

      dispatch(
        setUser({
          profile: response.data.user,
          role: response.data.user.role,
        }),
      )

      navigate("/dashboard")
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Registration failed"))
      throw err
    }
  }

  const logout = () => {
    dispatch(logoutAction())
    dispatch(clearUser())
    navigate("/login")
  }

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
    loading,
    error,
    profile,
    role,
    login,
    register,
    logout,
  }
}
