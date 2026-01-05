import { useRole } from "./useRole"

export const usePermissions = () => {
  const { isAdmin, isChauffeur } = useRole()

  const canAccessDrivers = isAdmin
  const canCreateTrip = isAdmin
  const canEditTrip = isAdmin
  const canDeleteTrip = isAdmin
  const canAddFuelRecord = true
  const canEditFuelRecord = isAdmin
  const canDeleteFuelRecord = isAdmin
  const canManageTrucks = isAdmin
  const canManageTrailers = isAdmin
  const canManageTires = isAdmin
  const canManageMaintenance = isAdmin
  const canViewAlerts = true
  const canResolveAlerts = isAdmin
  const canViewTrips = true

  return {
    canAccessDrivers,
    canCreateTrip,
    canEditTrip,
    canDeleteTrip,
    canAddFuelRecord,
    canEditFuelRecord,
    canDeleteFuelRecord,
    canManageTrucks,
    canManageTrailers,
    canManageTires,
    canManageMaintenance,
    canViewAlerts,
    canResolveAlerts,
    canGenerateMissionOrder,
    canViewTrips,
    canViewMissionOrders,
  }
}
