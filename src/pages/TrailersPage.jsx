

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "../components/DataTable"
import FormDrawer from "../components/FormDrawer"
import FormRenderer from "../components/forms/FormRenderer"
import ConfirmDialog from "../components/ConfirmDialog"
import StatusBadge from "../components/StatusBadge"
import {
  setTrailers,
  addTrailer,
  updateTrailer,
  deleteTrailer,
  setPagination,
  setFilters,
} from "../state/redux/slices/trailersSlice"
import { trailersService } from "../services/api/trailersService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const trailerFormFields = [
  { name: "registrationNumber", label: "Registration Number", type: "text", required: true, placeholder: "TRL-001" },
  { name: "type", label: "Type", type: "text", required: true, placeholder: "Box Van" },
  { name: "mileage", label: "Mileage", type: "number", required: true, placeholder: "10000" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "available", label: "Available" },
      { value: "unavailable", label: "Unavailable" },
      { value: "maintenance", label: "Maintenance" },
    ],
  },
]

export default function TrailersPage() {
  const dispatch = useDispatch()
  const { trailers, loading, pagination, filters } = useSelector((state) => state.trailers)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTrailer, setEditingTrailer] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [trailerToDelete, setTrailerToDelete] = useState(null)

  useEffect(() => {
    fetchTrailers()
  }, [pagination.page, pagination.pageSize, filters])

  const fetchTrailers = async () => {
    try {
      const response = await trailersService.getAll({
        page: pagination.page,
        limit: pagination.pageSize,
        search: filters.search,
        status: filters.status !== "all" ? filters.status : "",
      })
      dispatch(setTrailers(response.data.data || []))
      dispatch(setPagination({ total: response.data.total || 0 }))
    } catch (error) {
      console.error("Failed to fetch trailers:", error)
    }
  }

  const handleAdd = () => {
    setEditingTrailer(null)
    setDrawerOpen(true)
  }

  const handleEdit = (trailer) => {
    setEditingTrailer(trailer)
    setDrawerOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      if (editingTrailer) {
        const updatedData = {
          registrationNumber: data.registrationNumber,
          type: data.type,
          mileage: data.mileage,
          status: data.status,
        }
        const response = await trailersService.update(editingTrailer._id, updatedData)
        dispatch(updateTrailer(response.data.trailer))
      } else {
        const response = await trailersService.create(data)
        dispatch(addTrailer(response.data.trailer))
      }
      setDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save trailer:", error)
    }
  }

  const handleDeleteClick = (trailer) => {
    setTrailerToDelete(trailer)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await trailersService.delete(trailerToDelete._id)
      dispatch(deleteTrailer(trailerToDelete._id))
      setDeleteConfirmOpen(false)
      setTrailerToDelete(null)
    } catch (error) {
      console.error("Failed to delete trailer:", error)
    }
  }

  const columns = [
    { key: "registrationNumber", label: "Registration", className: "font-medium" },
    { key: "type", label: "Type" },
    { key: "mileage", label: "Mileage" },
    { key: "createdAt", label: "Created At" },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
  ]

  const filterComponent = (
    <Select value={filters.status} onValueChange={(value) => dispatch(setFilters({ status: value }))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="available">Available</SelectItem>
        <SelectItem value="unavailable">Unavailable</SelectItem>
        <SelectItem value="maintenance">Maintenance</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trailers</h1>
        <p className="text-muted-foreground mt-1">Manage your fleet of trailers</p>
      </div>

      <DataTable
        columns={columns}
        data={trailers}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
        onPageSizeChange={(pageSize) => dispatch(setPagination({ pageSize, page: 1 }))}
        onSearch={(search) => dispatch(setFilters({ search }))}
        onAdd={handleAdd }
        onEdit={handleEdit }
        onDelete={handleDeleteClick }
        searchPlaceholder="Search trailers..."
        addLabel="Add Trailer"
        filters={filterComponent}
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingTrailer ? "Edit Trailer" : "Add New Trailer"}
        description={editingTrailer ? "Update trailer information" : "Add a new trailer to your fleet"}
      >
        <FormRenderer
          fields={trailerFormFields}
          initialData={editingTrailer || {}}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerOpen(false)}
          submitLabel={editingTrailer ? "Update Trailer" : "Add Trailer"}
        />
      </FormDrawer>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Trailer"
        description={`Are you sure you want to delete ${trailerToDelete?.registration_number}? This action cannot be undone.`}
      />
    </div>
  )
}
