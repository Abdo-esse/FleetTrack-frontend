

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataTable from "../components/DataTable"
import FormDrawer from "../components/FormDrawer"
import FormRenderer from "../components/forms/FormRenderer"
import ConfirmDialog from "../components/ConfirmDialog"
import {
  setRules,
  addRule,
  updateRule,
  deleteRule,
  setRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} from "../state/redux/slices/maintenanceSlice"
import { maintenanceService } from "../services/api/maintenanceService"
import { usePermissions } from "../hooks/usePermissions"
import StatusBadge from "../components/StatusBadge"

const ruleFormFields = [
  { name: "name", label: "Rule Name", type: "text", required: true, placeholder: "Oil Change" },
  { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Rule description..." },
  { name: "intervalKm", label: "Interval (km)", type: "number", required: false, placeholder: "10000" },
  { name: "intervalDays", label: "Interval (days)", type: "number", required: false, placeholder: "90" },
  { name: "wearThreshold", label: "Wear Threshold", type: "number", required: false, placeholder: "6" },
  { name: "isActive", label: "Is Active", type: "checkbox", required: false },
  {
    name: "targetType",
    label: "Target Type",
    type: "select",
    required: true,
    options: [
      { value: "Truck", label: "Trucks" },
      { value: "Trailer", label: "Trailers" },
      { value: "Tire", label: "Tires" },
    ],
  },
]
const ruleFormFieldsUpdate = [
  { name: "name", label: "Rule Name", type: "text", required: true, placeholder: "Oil Change" },
  { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Rule description..." },
  { name: "intervalKm", label: "Interval (km)", type: "number", required: false, placeholder: "10000" },
  { name: "intervalDays", label: "Interval (days)", type: "number", required: false, placeholder: "90" },
  { name: "wearThreshold", label: "Wear Threshold", type: "number", required: false, placeholder: "6" },
  { name: "isActive", label: "Is Active", type: "checkbox", required: false },
]

const recordFormFields = [
  {
    name: "vehicle_type",
    label: "Vehicle Type",
    type: "select",
    required: true,
    options: [
      { value: "truck", label: "Truck" },
      { value: "trailer", label: "Trailer" },
    ],
  },
  { name: "vehicle_id", label: "Vehicle ID", type: "text", required: true, placeholder: "Registration number" },
  { name: "maintenance_type", label: "Maintenance Type", type: "text", required: true, placeholder: "Oil Change" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "cost", label: "Cost", type: "number", required: true, placeholder: "Total cost" },
  { name: "mileage", label: "Mileage", type: "number", required: true, placeholder: "Current mileage" },
  { name: "performed_by", label: "Performed By", type: "text", required: false, placeholder: "Mechanic name" },
  { name: "notes", label: "Notes", type: "textarea", required: false, placeholder: "Work performed..." },
]

export default function MaintenancePage() {
  const dispatch = useDispatch()
  const { rules, records, loading } = useSelector((state) => state.maintenance)

  const [ruleDrawerOpen, setRuleDrawerOpen] = useState(false)
  const [recordDrawerOpen, setRecordDrawerOpen] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [editingRecord, setEditingRecord] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState(null)

  useEffect(() => {
    fetchRules()
    fetchRecords()
  }, [])

  const fetchRules = async () => {
    try {
      const response = await maintenanceService.getRules()
      console.log(response.data)
      dispatch(setRules(response.data.data|| []))
    } catch (error) {
      console.error("Failed to fetch maintenance rules:", error)
    }
  }

  const fetchRecords = async () => {
    try {
      const response = await maintenanceService.getRecords()
      console.log(response.data)
      dispatch(setRecords(response.data.data || []))
    } catch (error) {
      console.error("Failed to fetch maintenance records:", error)
    }
  }

  const handleAddRule = () => {
    setEditingRule(null)
    setRuleDrawerOpen(true)
  }

  const handleEditRule = (rule) => {
    setEditingRule(rule)
    setRuleDrawerOpen(true)
  }

  const handleSubmitRule = async (data) => {
    try {
      if (editingRule) {
        const ruleUpdate = {
          name: data.name,
          description: data.description,
          intervalKm: data.intervalKm,
          intervalDays: data.intervalDays,
          wearThreshold: data.wearThreshold,
          isActive: data.isActive,
        }
        const response = await maintenanceService.updateRule(editingRule._id, ruleUpdate)
        dispatch(updateRule(response.data.rule))
      } else {
        const response = await maintenanceService.createRule(data)
        console.log(response.data)
        dispatch(addRule(response.data.rule))
      }
      setRuleDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save rule:", error)
    }
  }

  const handleAddRecord = () => {
    setEditingRecord(null)
    setRecordDrawerOpen(true)
  }

  const handleEditRecord = (record) => {
    setEditingRecord(record)
    setRecordDrawerOpen(true)
  }

  const handleSubmitRecord = async (data) => {
    try {
      if (editingRecord) {
        const response = await maintenanceService.updateRecord(editingRecord.id, data)
        dispatch(updateRecord(response.data))
      } else {
        const response = await maintenanceService.createRecord(data)
        dispatch(addRecord(response.data))
      }
      setRecordDrawerOpen(false)
    } catch (error) {
      console.error("Failed to save record:", error)
    }
  }

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item)
    setDeleteType(type)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      if (deleteType === "rule") {
        await maintenanceService.deleteRule(itemToDelete._id)
        dispatch(deleteRule(itemToDelete._id))
      } else {
        await maintenanceService.deleteRecord(itemToDelete._id)
        dispatch(deleteRecord(itemToDelete._id))
      }
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
      setDeleteType(null)
    } catch (error) {
      console.error("Failed to delete:", error)
    }
  }

  const ruleColumns = [
    { key: "name", label: "Rule Name", className: "font-medium" },
    { key: "description", label: "Description" },
    { key: "intervalKm", label: "Interval (km)", render: (value) => (value ? `${value?.toLocaleString()} km` : "N/A") },
    { key: "intervalDays", label: "Interval (days)", render: (value) => (value ? `${value} days` : "N/A") },
    { key: "wearThreshold", label: "Wear Threshold", render: (value) => (value ? `${value} days` : "N/A") },
    { key: "targetType", label: "Applies To", render: (value) => value?.charAt(0).toUpperCase() + value?.slice(1) },
    {key: "isActive", label: "Active", render: (value) => (value ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" />) },
  ]

  const recordColumns = [
    { key: "performedAt", label: "Date", className: "font-medium" },
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
    { key: "targetType", label: "Vehicle Type", render: (value) => value?.charAt(0).toUpperCase() + value?.slice(1) },
    { key: "targetId", label: "Vehicle ID" },
    { key: "mileageAtService", label: "Mileage at Service", render: (value) =>(value ? `${value?.toLocaleString()} km` : "N/A") },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
        <p className="text-muted-foreground mt-1">Manage maintenance rules and records</p>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList>
          <TabsTrigger value="rules">Maintenance Rules</TabsTrigger>
          <TabsTrigger value="records">Maintenance Records</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <DataTable
            columns={ruleColumns}
            data={rules}
            loading={loading}
            onAdd={ handleAddRule }
            onEdit={ handleEditRule }
            onDelete={ (rule) => handleDeleteClick(rule, "rule") }
            searchPlaceholder="Search rules..."
            addLabel="Add Rule"
          />
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <DataTable
            columns={recordColumns}
            data={records}
            loading={loading}
            onAdd={ handleAddRecord }
            onDelete={ (record) => handleDeleteClick(record, "record") }
            searchPlaceholder="Search records..."
            addLabel="Add Record"
          />
        </TabsContent>
      </Tabs>

      <FormDrawer
        open={ruleDrawerOpen}
        onOpenChange={setRuleDrawerOpen}
        title={editingRule ? "Edit Rule" : "Add Maintenance Rule"}
        description={editingRule ? "Update rule information" : "Create a new maintenance rule"}
      >
        <FormRenderer
          fields={editingRule ? ruleFormFieldsUpdate : ruleFormFields}
          initialData={editingRule || {}}
          onSubmit={handleSubmitRule}
          onCancel={() => setRuleDrawerOpen(false)}
          submitLabel={editingRule ? "Update Rule" : "Add Rule"}
        />
      </FormDrawer>

      <FormDrawer
        open={recordDrawerOpen}
        onOpenChange={setRecordDrawerOpen}
        title={editingRecord ? "Edit Record" : "Add Maintenance Record"}
        description={editingRecord ? "Update record information" : "Create a new maintenance record"}
      >
        <FormRenderer
          fields={recordFormFields}
          initialData={editingRecord || {}}
          onSubmit={handleSubmitRecord}
          onCancel={() => setRecordDrawerOpen(false)}
          submitLabel={editingRecord ? "Update Record" : "Add Record"}
        />
      </FormDrawer>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteType === "rule" ? "Rule" : "Record"}`}
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  )
}
