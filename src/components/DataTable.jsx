

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function DataTable({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onAdd,
  onEdit,
  onDelete,
  onAssign,
  onUpdateWearLevel,
  onAssignDriver,
  onSort,
  onTelechargeMissionOrder,
  searchPlaceholder = "Search...",
  addLabel = "Add New",
  filters,
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          {filters && <div className="flex items-center gap-2">{filters}</div>}
          <Button onClick={onSort}>
           sort
          </Button>
        </div>
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="w-[70px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data?.map((row, index) => (
                <TableRow key={row.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onAssign) && (
                    <TableCell className="text-right">
                      <Select onValueChange={(value) => {
                        if (value === 'edit' && onEdit) onEdit(row)
                        if (value === 'delete' && onDelete) onDelete(row)
                        if (value === 'assign' && onAssign) onAssign(row)
                        if (value === 'updateWearLevel' && onUpdateWearLevel) onUpdateWearLevel(row)
                        if (value === 'assignDriver' && onAssignDriver) onAssignDriver(row)
                        if (value === 'telechargeMissionOrder' && onTelechargeMissionOrder) onTelechargeMissionOrder(row)
                      }}>
                        <SelectTrigger className="h-8 w-8 p-0 border-0 bg-transparent hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open actions</span>
                        </SelectTrigger>
                        <SelectContent align="end" className="w-[160px]">
                          {onEdit && <SelectItem value="edit">Edit</SelectItem>}
                          {onDelete && <SelectItem value="delete" className="text-destructive focus:text-destructive">Delete</SelectItem>}
                          {onAssign && <SelectItem value="assign">Assign</SelectItem>}
                          {onUpdateWearLevel && <SelectItem value="updateWearLevel">Update Wear Level</SelectItem>}
                          {onAssignDriver && <SelectItem value="assignDriver">Assign Driver</SelectItem>}
                          {onTelechargeMissionOrder && <SelectItem value="telechargeMissionOrder">Telecharge Mission Order</SelectItem>}
                        </SelectContent>
                      </Select>
                    </TableCell>

                  )}

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select value={String(pagination.pageSize)} onValueChange={(value) => onPageSizeChange?.(Number(value))}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => onPageChange?.(1)} disabled={pagination.page === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 text-sm">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize) || 1}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange?.(Math.ceil(pagination.total / pagination.pageSize))}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
