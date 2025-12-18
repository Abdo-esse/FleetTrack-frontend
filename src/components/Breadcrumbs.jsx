

import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  const breadcrumbNameMap = {
    dashboard: "Dashboard",
    trucks: "Trucks",
    trailers: "Trailers",
    tires: "Tires",
    drivers: "Drivers",
    trips: "Trips",
    "fuel-records": "Fuel Records",
    maintenance: "Maintenance",
    alerts: "Alerts",
    "mission-orders": "Mission Orders",
    settings: "Settings",
  }

  if (pathnames.length === 0) return null

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`
        const isLast = index === pathnames.length - 1
        const label = breadcrumbNameMap[value] || value

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link to={to} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
