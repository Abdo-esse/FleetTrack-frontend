

import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "../components/AppSidebar"
import Header from "../components/Header"
import Breadcrumbs from "../components/Breadcrumbs"

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Breadcrumbs />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
