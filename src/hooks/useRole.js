import { useSelector } from "react-redux"

export const useRole = () => {
  const { role } = useSelector((state) => state.user)

  const isAdmin = role === "Admin"
  const isChauffeur = role === "Chauffeur"

  return {
    role,
    isAdmin,
    isChauffeur,
  }
}
