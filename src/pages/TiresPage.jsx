

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "../components/DataTable"
import FormDrawer from "../components/FormDrawer"
import FormRenderer from "../components/forms/FormRenderer"
import ConfirmDialog from "../components/ConfirmDialog"
import AssignTireDialog from "../components/AssignTireDialog"
import UpdateWearLevelDialog from "../components/UpdateWearLevelDialog"
import { Progress } from "@/components/ui/progress"
import { setTires, addTire, updateTire, deleteTire, setPagination, setFilters } from "../state/redux/slices/tiresSlice"
import { tiresService } from "../services/api/tiresService"
import { trucksService } from "../services/api/trucksService"
import { trailersService } from "../services/api/trailersService"
import { cn } from "../utils/cn"

const positions = [
  'avant gauche',
  'avant droit',
  'arrière gauche',
  'arrière droit',
  'centre gauche',
  'centre droit',
  'de secours',
];
const tireFormFields = (truckOptions, trailerOptions) => [
  { name: "reference", label: "Reference Number", type: "text", required: true, placeholder: "TIRE-001" },
  {
    name: "position",
    label: "Position",
    type: "select",
    required: true,
    placeholder: "Select Position",
    options: positions.map((position) => ({ value: position, label: position }))
  },
  { name: "wearLevel", label: "Wear Level (%)", type: "number", required: true, placeholder: "0-100" },
  {
    name: "assigned_to_type",
    label: "Assigned To",
    type: "select",
    required: false,
    options: [
      { value: null, label: "Not Assigned" },
      { value: "truck", label: "Truck" },
      { value: "trailer", label: "Trailer" },
    ],
  },
  {
    name: "truck_id",
    label: "Select Truck",
    type: "select",
    required: false,
    condition: (data) => data.assigned_to_type === "truck",
    options: truckOptions,
  },
  {
    name: "trailer_id",
    label: "Select Trailer",
    type: "select",
    required: false,
    condition: (data) => data.assigned_to_type === "trailer",
    options: trailerOptions,
  },
]
const tireFormFieldsUpdate = [
  { name: "reference", label: "Reference Number", type: "text", required: true, placeholder: "TIRE-001" },
  {
    name: "position",
    label: "Position",
    type: "select",
    required: true,
    placeholder: "Select Position",
    options: positions.map((position) => ({ value: position, label: position }))
  },
  { name: "wearLevel", label: "Wear Level (%)", type: "number", required: true, placeholder: "0-100" },

]

export default function TiresPage() {
  const dispatch = useDispatch()
  const { tires, loading, pagination, filters } = useSelector((state) => state.tires)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTire, setEditingTire] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [tireToDelete, setTireToDelete] = useState(null)
  const [truckOptions, setTruckOptions] = useState([])
  const [trailerOptions, setTrailerOptions] = useState([])
  const [assignedTire, setAssignedTire] = useState(null)
  const [assignConfirmOpen, setAssignConfirmOpen] = useState(false)
  const [updateWearLevelConfirmOpen, setUpdateWearLevelConfirmOpen] = useState(false)
  const [tireToUpdate, setTireToUpdate] = useState(null)

  useEffect(() => {
    fetchTires()
    fetchOptions()
  }, [pagination.page, pagination.pageSize, filters])

  const fetchOptions = async () => {
    try {
      const [trucksRes, trailersRes] = await Promise.all([
        trucksService.getAll({ limit: 1000 }),
        trailersService.getAll({ limit: 1000 })
      ])

      setTruckOptions(trucksRes.data.data.map(t => ({
        value: t._id,
        label: `${t.registrationNumber} - ${t.brand} ${t.model}`
      })))

      setTrailerOptions(trailersRes.data.data.map(t => ({
        value: t._id,
        label: `${t.registrationNumber} - ${t.type}`
      })))
    } catch (error) {
      console.error("Failed to fetch vehicle options:", error)
    }
  }

  const fetchTires = async () => {
    try {
      const response = await tiresService.getAll({
        page: pagination.page,
        limit: pagination.pageSize,
        search: filters.search,
      })
      dispatch(setTires(response.data.data || []))
      dispatch(setPagination({ total: response.data.total || 0 }))
    } catch (error) {
      console.error("Failed to fetch tires:", error)
    }
  }

  const handleAdd = () => {
    setEditingTire(null)
    setDrawerOpen(true)
  }

  const handleEdit = (tire) => {
    const formData = {
      ...tire,
      assigned_to_type: tire.assigned_to_type || "unassigned",
      truck_id: tire.assigned_to_type === "truck" ? tire.assigned_to_id : null,
      trailer_id: tire.assigned_to_type === "trailer" ? tire.assigned_to_id : null,
    }
    setEditingTire(formData)
    setDrawerOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      const apiData = { ...data }

      if (apiData.assigned_to_type === null) {
        apiData.assigned_to_id = null
      } else if (apiData.assigned_to_type === "truck") {
        apiData.truckId = apiData.truck_id
      } else if (apiData.assigned_to_type === "trailer") {
        apiData.trailerId = apiData.trailer_id
      }

      delete apiData.truck_id
      delete apiData.trailer_id
      delete apiData.assigned_to_type

      if (editingTire && editingTire._id) {
        const updateData = {
          reference: apiData.reference,
          position: apiData.position,
          wearLevel: apiData.wearLevel,
        }
        const response = await tiresService.update(editingTire._id, updateData)
        dispatch(updateTire(response.data.tire))
      } else {
        const response = await tiresService.create(apiData)
        dispatch(addTire(response.data.tire))
      }
      setDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save tire:", error)
    }
  }

  const handleDeleteClick = (tire) => {
    setTireToDelete(tire)
    setDeleteConfirmOpen(true)
  }

  const handleAssign = (tire) => {
    setAssignedTire(tire)
    setAssignConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await tiresService.delete(tireToDelete._id)
      dispatch(deleteTire(tireToDelete._id))
      setDeleteConfirmOpen(false)
      setTireToDelete(null)
    } catch (error) {
      console.error("Failed to delete tire:", error)
    }
  }

  const handleAssignConfirm = async (assignmentData) => {
    try {
      const updateData = {}
      if (assignmentData.assigned_to_type === 'truck') {
        updateData.truckId = assignmentData.assigned_to_id
      } else {
        updateData.trailerId = assignmentData.assigned_to_id
      }

      console.log(updateData)
      const response = await tiresService.assignToVehicle(assignedTire._id, updateData)
      console.log(response)
      dispatch(updateTire(response.data.tire))
      setAssignConfirmOpen(false)
      setAssignedTire(null)
    } catch (error) {
      console.error("Failed to assign tire", error)
    }
  }

  const handleUpdateWearLevel = (tire) => {
    setTireToUpdate(tire)
    setUpdateWearLevelConfirmOpen(true)
  }

  const handleUpdateWearLevelConfirm = async (newWearLevel, note) => {
    try {
      const updateData = {
        wearLevel: newWearLevel,
        note
      }
      const response = await tiresService.updateWearLevel(tireToUpdate._id, updateData)
      dispatch(updateTire(response.data.tire))
      setUpdateWearLevelConfirmOpen(false)
      setTireToUpdate(null)
    } catch (error) {
      console.error("Failed to update wear level:", error)
    }
  }

  const columns = [
    { key: "reference", label: "Reference Number", className: "font-medium" },
    { key: "position", label: "Position" },
    {
      key: "wearLevel",
      label: "Wear Level",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Progress value={value} className={cn("w-[100px]", value > 70 && "bg-destructive/20")} />
          <span className="text-sm">{value}%</span>
        </div>
      ),
    },
    {
      key: "assigned_to",
      label: "Assigned To",
      render: (_, row) => {
        if (row.trailerId) {
          return `Trailer - ${row.trailerId.registrationNumber}`
        }

        if (row.truckId) {
          return `Truck - ${row.truckId.registrationNumber}`
        }

        return "Not Assigned"
      },
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tires</h1>
        <p className="text-muted-foreground mt-1">Manage your tire inventory and track wear levels</p>
      </div>

      <DataTable
        columns={columns}
        data={tires}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
        onPageSizeChange={(pageSize) => dispatch(setPagination({ pageSize, page: 1 }))}
        onSearch={(search) => dispatch(setFilters({ search }))}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAssign={handleAssign}
        onUpdateWearLevel={handleUpdateWearLevel}
        searchPlaceholder="Search tires..."
        addLabel="Add Tire"
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingTire ? "Edit Tire" : "Add New Tire"}
        description={editingTire ? "Update tire information" : "Add a new tire to your inventory"}
      >
        <FormRenderer
          fields={editingTire ? tireFormFieldsUpdate : tireFormFields(truckOptions, trailerOptions)}
          initialData={editingTire || {}}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerOpen(false)}
          submitLabel={editingTire && editingTire.id ? "Update Tire" : "Add Tire"}
        />
      </FormDrawer>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Tire"
        description={`Are you sure you want to delete ${tireToDelete?.serial_number}? This action cannot be undone.`}
      />

      <AssignTireDialog
        open={assignConfirmOpen}
        onOpenChange={setAssignConfirmOpen}
        onConfirm={handleAssignConfirm}
        truckOptions={truckOptions}
        trailerOptions={trailerOptions}
        tire={assignedTire}
      />
      <UpdateWearLevelDialog
        open={updateWearLevelConfirmOpen}
        onOpenChange={setUpdateWearLevelConfirmOpen}
        onConfirm={handleUpdateWearLevelConfirm}
        tire={tireToUpdate}
      />
    </div>
  )
}
