

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CheckCircle } from "lucide-react"
import DataTable from "../components/DataTable"
import StatusBadge from "../components/StatusBadge"
import ConfirmDialog from "../components/ConfirmDialog"
import { Button } from "@/components/ui/button"

import { setAlerts, resolveAlert, setPagination, setFilters } from "../state/redux/slices/alertsSlice"
import { alertsService } from "../services/api/alertsService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePermissions } from "../hooks/usePermissions"



export default function AlertsPage() {
  const dispatch = useDispatch()
  const { alerts, loading, pagination, filters } = useSelector((state) => state.alerts)
  const { canResolveAlerts } = usePermissions()

  const [resolveConfirmOpen, setResolveConfirmOpen] = useState(false)
  const [alertToResolve, setAlertToResolve] = useState(null)

  useEffect(() => {
    fetchAlerts()
  }, [pagination.page, pagination.pageSize, filters])

  const fetchAlerts = async () => {
    try {
      const response = await alertsService.getAll({
        page: pagination.page,
        limit: pagination.pageSize,
        // type: filters.type !== "all" ? filters.type : undefined,
        // status: filters.status !== "all" ? filters.status : undefined,
      })
      console.log(response.data)
      dispatch(setAlerts(response.data.data || []))
      dispatch(setPagination({ total: response.data.total || 0 }))
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    }
  }

  const handleResolveClick = (alert) => {
    setAlertToResolve(alert)
    setResolveConfirmOpen(true)
  }

  const handleResolveConfirm = async () => {
    try {
      await alertsService.resolve(alertToResolve._id)
      dispatch(resolveAlert(alertToResolve._id))
      setResolveConfirmOpen(false)
      setAlertToResolve(null)
    } catch (error) {
      console.error("Failed to resolve alert:", error)
    }
  }

  const columns = [
    {
      key: "rule",
      label: "Rule",
      className: "font-medium",
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{value}</span>
          {row.ruleId && typeof row.ruleId === 'object' && row.ruleId.description && (
            <span className="text-xs text-muted-foreground">{row.ruleId.description}</span>
          )}
        </div>
      )
    },
    { key: "reason", label: "Reason" },
    { key: "targetType", label: "Target Type" },
    { key: "targetId", label: "Target ID", className: "font-mono text-xs" },
    {
      key: "triggeredAt",
      label: "Triggered At",
      render: (value) => value ? new Date(value).toLocaleString() : "-"
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString()
    },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) =>
        row.status === "active" &&
        canResolveAlerts && (
          <Button size="sm" variant="outline" onClick={() => handleResolveClick(row)}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Resolve
          </Button>
        ),
    },
  ]

  const filterComponents = (
    <>
      <Select value={filters.type} onValueChange={(value) => dispatch(setFilters({ type: value }))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="tire">Tire Wear</SelectItem>
          <SelectItem value="license">License Expiry</SelectItem>
          <SelectItem value="inspection">Inspection Due</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.status} onValueChange={(value) => dispatch(setFilters({ status: value }))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
    </>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
        <p className="text-muted-foreground mt-1">Monitor and resolve fleet alerts</p>
      </div>

      <DataTable
        columns={columns}
        data={alerts}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
        onPageSizeChange={(pageSize) => dispatch(setPagination({ pageSize, page: 1 }))}
        searchPlaceholder="Search alerts..."
        filters={filterComponents}
      />

      <ConfirmDialog
        open={resolveConfirmOpen}
        onOpenChange={setResolveConfirmOpen}
        onConfirm={handleResolveConfirm}
        title="Resolve Alert"
        description={`Are you sure you want to mark this alert as resolved?`}
      />
    </div>
  )
}
