

import { Badge } from "@/components/ui/badge"
import { cn } from "../utils/cn"

const statusConfig = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
  maintenance: { label: "Maintenance", variant: "destructive" },
  planned: { label: "Planned", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  pending: { label: "Pending", variant: "secondary" },
  resolved: { label: "Resolved", variant: "outline" },
  available: { label: "Available", variant: "default" },
  assigned: { label: "Assigned", variant: "secondary" },
}

export default function StatusBadge({ status, className }) {
  const config = statusConfig[status] || { label: status, variant: "secondary" }

  return (
    <Badge variant={config.variant} className={cn("capitalize", className)}>
      {config.label}
    </Badge>
  )
}
