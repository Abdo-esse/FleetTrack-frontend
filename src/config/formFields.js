// Centralized form field configurations for easy management and extension

export const truckFormFields = [
  { name: "registration_number", label: "Registration Number", type: "text", required: true, placeholder: "TRK-001" },
  { name: "brand", label: "Brand", type: "text", required: true, placeholder: "Mercedes" },
  { name: "model", label: "Model", type: "text", required: true, placeholder: "Actros" },
  { name: "year", label: "Year", type: "number", required: true, placeholder: "2023" },
  { name: "vin", label: "VIN", type: "text", required: true, placeholder: "VIN123456789" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "maintenance", label: "Maintenance" },
    ],
  },
  { name: "mileage", label: "Mileage (km)", type: "number", required: true, placeholder: "50000" },
  { name: "last_service_date", label: "Last Service Date", type: "date", required: false },
  { name: "notes", label: "Notes", type: "textarea", required: false, placeholder: "Additional information..." },
]

export const trailerFormFields = [
  { name: "registration_number", label: "Registration Number", type: "text", required: true, placeholder: "TRL-001" },
  { name: "type", label: "Type", type: "text", required: true, placeholder: "Box Van" },
  { name: "brand", label: "Brand", type: "text", required: true, placeholder: "Krone" },
  { name: "year", label: "Year", type: "number", required: true, placeholder: "2023" },
  { name: "capacity", label: "Capacity (tons)", type: "number", required: true, placeholder: "24" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "maintenance", label: "Maintenance" },
    ],
  },
  { name: "last_service_date", label: "Last Service Date", type: "date", required: false },
  { name: "notes", label: "Notes", type: "textarea", required: false, placeholder: "Additional information..." },
]

export const driverFormFields = [
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
