

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function FormRenderer({ fields, initialData = {}, onSubmit, onCancel, submitLabel = "Submit" }) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
      if (field.validation) {
        const error = field.validation(formData[field.name], formData)
        if (error) {
          newErrors[field.name] = error
        }
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      disabled: field.disabled,
    }

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
      case "tel":
        return (
          <Input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        )

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={field.rows || 3}
          />
        )

      case "select":
        return (
          <Select value={formData[field.name] || ""} onValueChange={(value) => handleChange(field.name, value)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {renderField(field)}
          {errors[field.name] && <p className="text-sm text-destructive">{errors[field.name]}</p>}
          {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
