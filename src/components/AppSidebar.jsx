

import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Truck,
  Container,
  CircleDot,
  Users,
  Route,
  Fuel,
  Wrench,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useRole } from "../hooks/useRole"
import { cn } from "../utils/cn"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Chauffeur"] },
  { name: "Trucks", href: "/trucks", icon: Truck, roles: ["Admin", "Chauffeur"] },
  { name: "Trailers", href: "/trailers", icon: Container, roles: ["Admin", "Chauffeur"] },
  { name: "Tires", href: "/tires", icon: CircleDot, roles: ["Admin", "Chauffeur"] },
  { name: "Drivers", href: "/drivers", icon: Users, roles: ["Admin"] },
  { name: "Trips", href: "/trips", icon: Route, roles: ["Admin", "Chauffeur"] },
  { name: "Fuel Records", href: "/fuel-records", icon: Fuel, roles: ["Admin", "Chauffeur"] },
  { name: "Maintenance", href: "/maintenance", icon: Wrench, roles: ["Admin"] },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle, roles: ["Admin", "Chauffeur"] },
  { name: "Mission Orders", href: "/mission-orders", icon: FileText, roles: ["Admin", "Chauffeur"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["Admin", "Chauffeur"] },
]

export default function AppSidebar() {
  const location = useLocation()
  const { role } = useRole()

  const filteredItems = navigationItems.filter((item) => item.roles.includes(role))

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">Fleet Manager</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href} className={cn("flex items-center gap-3")}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground">Fleet Management System v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}
