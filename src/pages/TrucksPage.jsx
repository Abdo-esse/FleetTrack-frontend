

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "../components/DataTable"
import FormDrawer from "../components/FormDrawer"
import FormRenderer from "../components/forms/FormRenderer"
import ConfirmDialog from "../components/ConfirmDialog"
import StatusBadge from "../components/StatusBadge"
import {
  setTrucks,
  addTruck,
  updateTruck,
  deleteTruck,
  setPagination,
  setFilters,
} from "../state/redux/slices/trucksSlice"
import { trucksService } from "../services/api/trucksService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const truckFormFields = [
  { name: "registrationNumber", label: "Registration Number", type: "text", required: true, placeholder: "TRK-001" },
  { name: "brand", label: "Brand", type: "text", required: true, placeholder: "Mercedes" },
  { name: "model", label: "Model", type: "text", required: true, placeholder: "Actros" },
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
  { name: "mileage", label: "Mileage (km)", type: "number", required: true, placeholder: "50000" },
]
const truckFormFieldsUpdate = [
  { name: "brand", label: "Brand", type: "text", required: true, placeholder: "Mercedes" },
  { name: "model", label: "Model", type: "text", required: true, placeholder: "Actros" },
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
  { 
    name: "mileage",
     label: "Mileage (km)",
      type: "number",
      required: true,
       placeholder: "50000" },
]

export default function TrucksPage() {
  const dispatch = useDispatch()
  const { trucks, loading, pagination, filters } = useSelector((state) => state.trucks)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTruck, setEditingTruck] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [truckToDelete, setTruckToDelete] = useState(null)
  const [sort, setSort] = useState("asc")
  
  console.log("Current sort order:", trucks)
  const truckFilter= trucks.slice().sort((a,b)=>{
    if(sort === "asc"){
      return a.mileage - b.mileage
    }
    return b.mileage - a.mileage
      
  })

  useEffect(() => {
    fetchTrucks()
  }, [pagination.page, pagination.pageSize, filters])

  const fetchTrucks = async () => {
    console.log("Fetching trucks with filters:", filters, "and pagination:", pagination)
    try {
      const response = await trucksService.getAll({
        page: pagination.page,
        limit: pagination.pageSize,
        search: filters.search,
        status: filters.status !== "all" ? filters.status : "",
      })
      console.log("Fetched trucks:", response.data)
      dispatch(setTrucks(response.data.data || []))
      dispatch(setPagination({ total: response.data.total || 0 }))
    } catch (error) {
      console.error("Failed to fetch trucks:", error)
    }
  }

  const handleAdd = () => {
    setEditingTruck(null)
    setDrawerOpen(true)
  }

  const handleEdit = (truck) => {
    setEditingTruck(truck)
    setDrawerOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      if (editingTruck) {
        console.log(data)
        const truckData = {
          brand: data.brand,
          model: data.model,
          status: data.status,
          mileage: data.mileage,
        }
        const response = await trucksService.update(editingTruck._id, truckData)
        dispatch(updateTruck(response.data.truck))
      } else {
        const response = await trucksService.create(data)
        dispatch(addTruck(response.data.truck))
      }
      setDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save truck:", error)
    }
  }

  const handleDeleteClick = (truck) => {
    setTruckToDelete(truck)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await trucksService.delete(truckToDelete._id)
      dispatch(deleteTruck(truckToDelete._id))
      setDeleteConfirmOpen(false)
      setTruckToDelete(null)
    } catch (error) {
      console.error("Failed to delete truck:", error)
    }
  }
  const handleSort = () => {
    setSort(sort === "asc" ? "desc" : "asc")
  }

  const columns = [
    { key: "registrationNumber", label: "Registration", className: "font-medium" },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "createdAt", label: "Created At" },
    { key: "mileage", label: "Mileage",
       render: (value, row) =>{
          return <span > {value?.toLocaleString()} km</span>

       } , },
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
        <h1 className="text-3xl font-bold text-foreground">Trucks</h1>
        <p className="text-muted-foreground mt-1">Manage your fleet of trucks</p>
      </div>

      <DataTable
        columns={columns}
        data={truckFilter}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
        onPageSizeChange={(pageSize) => dispatch(setPagination({ pageSize, page: 1 }))}
        onSearch={(search) => dispatch(setFilters({ search }))}
        onAdd={handleAdd }
        onEdit={handleEdit }
        onDelete={handleDeleteClick }
        onSort={handleSort}
        searchPlaceholder="Search trucks..."
        addLabel="Add Truck"
        filters={filterComponent}
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingTruck ? "Edit Truck" : "Add New Truck"}
        description={editingTruck ? "Update truck information" : "Add a new truck to your fleet"}
      >
        <FormRenderer
          fields={editingTruck ? truckFormFieldsUpdate : truckFormFields}
          initialData={editingTruck || {}}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerOpen(false)}
          submitLabel={editingTruck ? "Update Truck" : "Add Truck"}
        />
      </FormDrawer>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Truck"
        description={`Are you sure you want to delete ${truckToDelete?.registration_number}? This action cannot be undone.`}
      />
    </div>
  )
}
