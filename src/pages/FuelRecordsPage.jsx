

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "../components/DataTable"
import FormDrawer from "../components/FormDrawer"
import FormRenderer from "../components/forms/FormRenderer"
import ConfirmDialog from "../components/ConfirmDialog"
import {
  setFuelRecords,
  addFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
  setPagination,
  setFilters,
} from "../state/redux/slices/fuelRecordsSlice"
import { fuelRecordsService } from "../services/api/fuelRecordsService"
import { usePermissions } from "../hooks/usePermissions"

const fuelRecordFormFields = [
  { name: "trip_id", label: "Trip ID", type: "text", required: true, placeholder: "Associated trip ID" },
  { name: "truck_id", label: "Truck", type: "text", required: true, placeholder: "Truck registration" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "location", label: "Location", type: "text", required: true, placeholder: "Gas station location" },
  { name: "liters", label: "Liters", type: "number", required: true, placeholder: "Fuel quantity" },
  { name: "cost", label: "Cost", type: "number", required: true, placeholder: "Total cost" },
  { name: "mileage", label: "Mileage", type: "number", required: true, placeholder: "Current mileage" },
  { name: "notes", label: "Notes", type: "textarea", required: false, placeholder: "Additional notes..." },
]

export default function FuelRecordsPage() {
  const dispatch = useDispatch()
  const { fuelRecords, loading, pagination, filters } = useSelector((state) => state.fuelRecords)
  const { canAddFuelRecord, canEditFuelRecord, canDeleteFuelRecord } = usePermissions()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState(null)

  useEffect(() => {
    fetchFuelRecords()
  }, [pagination.page, pagination.pageSize, filters])

  const fetchFuelRecords = async () => {
    try {
      const response = await fuelRecordsService.getAll({
        page: pagination.page,
        limit: pagination.pageSize,
        search: filters.search,
        trip_id: filters.tripId,
      })
      dispatch(setFuelRecords(response.data.results || []))
      dispatch(setPagination({ total: response.data.total || 0 }))
    } catch (error) {
      console.error("Failed to fetch fuel records:", error)
    }
  }

  const handleAdd = () => {
    setEditingRecord(null)
    setDrawerOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setDrawerOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      if (editingRecord) {
        const response = await fuelRecordsService.update(editingRecord.id, data)
        dispatch(updateFuelRecord(response.data))
      } else {
        const response = await fuelRecordsService.create(data)
        dispatch(addFuelRecord(response.data))
      }
      setDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save fuel record:", error)
    }
  }

  const handleDeleteClick = (record) => {
    setRecordToDelete(record)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await fuelRecordsService.delete(recordToDelete.id)
      dispatch(deleteFuelRecord(recordToDelete.id))
      setDeleteConfirmOpen(false)
      setRecordToDelete(null)
    } catch (error) {
      console.error("Failed to delete fuel record:", error)
    }
  }

  const columns = [
    { key: "date", label: "Date", className: "font-medium" },
    { key: "trip_id", label: "Trip" },
    { key: "truck_id", label: "Truck" },
    { key: "location", label: "Location" },
    { key: "liters", label: "Liters", render: (value) => `${value} L` },
    { key: "cost", label: "Cost", render: (value) => `$${value?.toFixed(2)}` },
    { key: "mileage", label: "Mileage", render: (value) => `${value?.toLocaleString()} km` },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fuel Records</h1>
        <p className="text-muted-foreground mt-1">Track fuel consumption and costs</p>
      </div>

      <DataTable
        columns={columns}
        data={fuelRecords}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
        onPageSizeChange={(pageSize) => dispatch(setPagination({ pageSize, page: 1 }))}
        onSearch={(search) => dispatch(setFilters({ search }))}
        onAdd={canAddFuelRecord ? handleAdd : undefined}
        onEdit={canEditFuelRecord ? handleEdit : undefined}
        onDelete={canDeleteFuelRecord ? handleDeleteClick : undefined}
        searchPlaceholder="Search fuel records..."
        addLabel="Add Fuel Record"
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingRecord ? "Edit Fuel Record" : "Add Fuel Record"}
        description={editingRecord ? "Update fuel record information" : "Add a new fuel consumption record"}
      >
        <FormRenderer
          fields={fuelRecordFormFields}
          initialData={editingRecord || {}}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerOpen(false)}
          submitLabel={editingRecord ? "Update Record" : "Add Record"}
        />
      </FormDrawer>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Fuel Record"
        description="Are you sure you want to delete this fuel record? This action cannot be undone."
      />
    </div>
  )
}
