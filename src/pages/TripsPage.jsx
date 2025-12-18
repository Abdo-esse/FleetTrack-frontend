

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import DataTable from "../components/DataTable"
import FormDrawer from "../components/FormDrawer"
import FormRenderer from "../components/forms/FormRenderer"
import ConfirmDialog from "../components/ConfirmDialog"
import StatusBadge from "../components/StatusBadge"
import { setTrips, addTrip, updateTrip, deleteTrip, setPagination, setFilters } from "../state/redux/slices/tripsSlice"
import { tripsService } from "../services/api/tripsService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { usePermissions } from "../hooks/usePermissions"
import { trucksService } from "../services/api/trucksService"
import { trailersService } from "../services/api/trailersService"
import { driversService } from "../services/api/driversService"
import AssignDriverDialog from "../components/AssignDriverDialog"
import CompleteTripDialog from "../components/CompleteTripDialog"

const tripFormFields = (trucksOptions, trailersOptions) => [
  { name: "truckId", label: "Truck", type: "select", required: true, placeholder: "Truck Registration", options: trucksOptions },
  { name: "trailerId", label: "Trailer", type: "select", required: false, placeholder: "Trailer Registration", options: trailersOptions },
  { name: "origin", label: "Origin", type: "text", required: true, placeholder: "Starting location" },
  { name: "destination", label: "Destination", type: "text", required: true, placeholder: "Destination location" },
  {
    name: "departureMileage",
    label: "Departure Mileage",
    type: "number",
    required: true,
    placeholder: "Starting mileage",
  },
]

export default function TripsPage() {
  const dispatch = useDispatch()
  const { trips, loading, pagination, filters } = useSelector((state) => state.trips)
  const { canCreateTrip, canEditTrip, canDeleteTrip } = usePermissions()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [tripToDelete, setTripToDelete] = useState(null)
  const [truckOptions, setTruckOptions] = useState([])
  const [trailerOptions, setTrailerOptions] = useState([])
  const [driverOptions, setDriverOptions] = useState([])
  const [assignDriverOpen, setAssignDriverOpen] = useState(false)
  const [tripToAssign, setTripToAssign] = useState(null)
  const [completeTripOpen, setCompleteTripOpen] = useState(false)


  useEffect(() => {
    fetchTrips()
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

      const driversRes = await driversService.getAll({ limit: 1000 })
      setDriverOptions(driversRes.data.data.map(d => ({
        value: d._id,
        label: d.name
      })))
    } catch (error) {
      console.error("Failed to fetch vehicle options:", error)
    }
  }
  const fetchTrips = async () => {
    try {
      const response = await tripsService.getAll({
        page: pagination.page,
        limit: pagination.pageSize,
        status: filters.status !== "all" ? filters.status : "",
      })
      console.log("Fetched trips:", response.data.data)
      dispatch(setTrips(response.data.data || []))
      dispatch(setPagination({ total: response.data.total || 0 }))
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    }
  }

  const handleAdd = () => {
    setEditingTrip(null)
    setDrawerOpen(true)
  }

  const fields = tripFormFields(truckOptions, trailerOptions)

  const handleEdit = (trip) => {
    setEditingTrip(trip)
    setDrawerOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      if (editingTrip) {
        const response = await tripsService.update(editingTrip.id, data)
        dispatch(updateTrip(response.data))
      } else {
        const response = await tripsService.create(data)
        dispatch(addTrip(response.data.trip))
      }
      setDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save trip:", error)
    }
  }

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await tripsService.delete(tripToDelete._id)
      dispatch(deleteTrip(tripToDelete._id))
      setDeleteConfirmOpen(false)
      setTripToDelete(null)
    } catch (error) {
      console.error("Failed to delete trip:", error)
    }
  }

  const handleStartTrip = async (trip) => {
    try {
      const response = await tripsService.startTrip(trip._id, {
        departureMileage: prompt("Enter departure mileage:"),
        status: "in_progress",
      })
      dispatch(updateTrip(response.data.trip))
    } catch (error) {
      console.error("Failed to start trip:", error)
    }
  }

  const handleCompleteTrip = (trip) => {
    setTripToAssign(trip)
    setCompleteTripOpen(true)
  }

  const handleCompleteTripConfirm = async (data) => {
    try {
      console.log("Complete trip data:", data)
      const response = await tripsService.completeTrip(tripToAssign._id, {
        ...data,
        status: "completed"
      })
      console.log("Complete trip response:", response.data)
      dispatch(updateTrip(response.data))
      setCompleteTripOpen(false)
      setTripToAssign(null)
    } catch (error) {
      console.error("Failed to complete trip:", error)
    }
  }

  const handleAssignDriver = (trip) => {
    setTripToAssign(trip)
    setAssignDriverOpen(true)
  }

  const handleAssignDriverConfirm = async (data) => {
    try {
      const response = await tripsService.assignDriver(tripToAssign._id, data)
      dispatch(updateTrip(response.data.trip))
      setAssignDriverOpen(false)
      setTripToAssign(null)
    } catch (error) {
      console.error("Failed to assign driver:", error)
    }
  }

  const handleTelechargeMissionOrder = async (trip) => {
  try {
    const response = await tripsService.telechargeMissionOrder(trip._id);

    const blob = new Blob([response.data], {
      type: 'application/pdf',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `mission-order-${trip._id}.pdf`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur téléchargement PDF', error);
  }
};


  const columns = [
    {
      key: "driver_id",
      label: "Driver",
      className: "font-medium",
      render: (_, row) => {
        if (row?.driverId) {
          return row.driverId.name
        }
        return "not assigned"
      }
    },
    {
      key: "truck_id",
      label: "Truck",
      className: "font-medium",
      render: (_, row) => {
        console.log(row)
        if (row.truckId) {
          return row.truckId.registrationNumber
        }
        return "not assigned"
      }
    },
    {
      key: "trailer_id",
      label: "Trailer",
      className: "font-medium",
      render: (_, row) => {
        if (row.trailerId) {
          return row.trailerId.registrationNumber
        }
        return "not assigned"
      }
    },
    { key: "origin", label: "Origin" },
    { key: "destination", label: "Destination" },
    { key: "departureMileage", label: "Departure Mileage" },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
    {
      key: "actions",
      label: "Quick Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === "planned" && canEditTrip && (
            <Button size="sm" variant="outline" onClick={() => handleStartTrip(row)}>
              Start
            </Button>
          )}
          {row.status === "in_progress" && canEditTrip && (
            <Button size="sm" variant="outline" onClick={() => handleCompleteTrip(row)}>
              Complete
            </Button>
          )}
        </div>
      ),
    },
  ]

  const filterComponent = (
    <Select value={filters.status} onValueChange={(value) => dispatch(setFilters({ status: value }))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="planned">Planned</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Trips</h1>
        <p className="text-muted-foreground mt-1">Manage and track your trips</p>
      </div>

      <DataTable
        columns={columns}
        data={trips}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
        onPageSizeChange={(pageSize) => dispatch(setPagination({ pageSize, page: 1 }))}
        onSearch={(search) => dispatch(setFilters({ search }))}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onAssignDriver={handleAssignDriver}
        onTelechargeMissionOrder={handleTelechargeMissionOrder}
        searchPlaceholder="Search trips..."
        addLabel="Create Trip"
        filters={filterComponent}
      />

      <FormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editingTrip ? "Edit Trip" : "Create New Trip"}
        description={editingTrip ? "Update trip information" : "Create a new trip assignment"}
      >
        <FormRenderer
          fields={fields}
          initialData={editingTrip || {}}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerOpen(false)}
          submitLabel={editingTrip ? "Update Trip" : "Create Trip"}
        />
      </FormDrawer>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Trip"
        description="Are you sure you want to delete this trip? This action cannot be undone."
      />
      <AssignDriverDialog
        open={assignDriverOpen}
        onOpenChange={setAssignDriverOpen}
        trip={tripToAssign}
        onConfirm={handleAssignDriverConfirm}
        driverOptions={driverOptions}
      />
      <CompleteTripDialog
        open={completeTripOpen}
        onOpenChange={setCompleteTripOpen}
        onConfirm={handleCompleteTripConfirm}
        trip={tripToAssign}
      />
    </div>
  )
}
