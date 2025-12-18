

import { Truck, Container, AlertTriangle, Route } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import StatusBadge from "../components/StatusBadge"

export default function DashboardPage() {
  const kpis = [
    { label: "Total Trucks", value: "24", icon: Truck, trend: "+2 this month" },
    { label: "Active Trips", value: "8", icon: Route, trend: "3 in progress" },
    { label: "Maintenance Alerts", value: "5", icon: AlertTriangle, trend: "2 urgent" },
    { label: "Total Trailers", value: "18", icon: Container, trend: "16 available" },
  ]

  const recentTrips = [
    { id: 1, driver: "John Smith", truck: "TRK-001", destination: "New York", status: "in_progress" },
    { id: 2, driver: "Jane Doe", truck: "TRK-005", destination: "Chicago", status: "completed" },
    { id: 3, driver: "Mike Johnson", truck: "TRK-012", destination: "Los Angeles", status: "planned" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your fleet management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Truck</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{trip.driver}</TableCell>
                    <TableCell>{trip.truck}</TableCell>
                    <TableCell>{trip.destination}</TableCell>
                    <TableCell>
                      <StatusBadge status={trip.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chart Placeholder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border border-dashed border-border rounded-md">
              <p className="text-muted-foreground">Chart visualization area</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
