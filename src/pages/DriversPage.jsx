

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "../components/DataTable"
import FormDrawer from "../components/FormDrawer"
import FormRenderer from "../components/forms/FormRenderer"
import ConfirmDialog from "../components/ConfirmDialog"
import StatusBadge from "../components/StatusBadge"
import {
  setDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  setPagination,
  setFilters,
} from "../state/redux/slices/driversSlice"
import { driversService } from "../services/api/driversService"

const driverFormFields = [
  { name: "name", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "john.doe@company.com" },
  { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+1 (555) 000-0000" },
  { name: "license_number", label: "License Number", type: "text", required: true, placeholder: "DL123456789" },
  { name: "license_expiry", label: "License Expiry", type: "date", required: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  { name: "address", label: "Address", type: "textarea", required: false, placeholder: "Street address..." },
]

export default function DriversPage() {
  const dispatch = useDispatch()
  const { drivers, loading, pagination, filters } = useSelector((state) => state.drivers)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [driverToDelete, setDriverToDelete] = useState(null)

  useEffect(() => {
    fetchDrivers()
  }, [pagination.page, pagination.pageSize, filters])

  const fetchDrivers = async () => {
    try {
      const response = await driversService.getAll({
        page: pagination.page,
        limit: pagination.pageSize,
        // search: filters.search,
        // status: filters.status !== "all" ? filters.status : undefined,
      })
      console.log("Fetched drivers:", response.data)
      dispatch(setDrivers(response.data.data || []))
      dispatch(setPagination({ total: response.data.total || 0 }))
    } catch (error) {
      console.error("Failed to fetch drivers:", error)
    }
  }

  const handleAdd = () => {
    setEditingDriver(null)
    setDrawerOpen(true)
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setDrawerOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      if (editingDriver) {
        const response = await driversService.update(editingDriver.id, data)
        dispatch(updateDriver(response.data))
      } else {
        const response = await driversService.create(data)
        dispatch(addDriver(response.data))
      }
      setDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save driver:", error)
    }
  }

  const handleDeleteClick = (driver) => {
    setDriverToDelete(driver)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await driversService.delete(driverToDelete.id)
      dispatch(deleteDriver(driverToDelete.id))
      setDeleteConfirmOpen(false)
      setDriverToDelete(null)
    } catch (error) {
      console.error("Failed to delete driver:", error)
    }
  }

  const columns = [
    { key: "name", label: "Name", className: "font-medium" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Created At" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
        <p className="text-muted-foreground mt-1">Manage your driver roster</p>
      </div>

      <DataTable
        columns={columns}
        data={drivers}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
        onPageSizeChange={(pageSize) => dispatch(setPagination({ pageSize, page: 1 }))}
        onSearch={(search) => dispatch(setFilters({ search }))}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        searchPlaceholder="Search drivers..."
        addLabel="Add Driver"
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingDriver ? "Edit Driver" : "Add New Driver"}
        description={editingDriver ? "Update driver information" : "Add a new driver to your roster"}
      >
        <FormRenderer
          fields={driverFormFields}
          initialData={editingDriver || {}}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerOpen(false)}
          submitLabel={editingDriver ? "Update Driver" : "Add Driver"}
        />
      </FormDrawer>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        description={`Are you sure you want to delete ${driverToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
