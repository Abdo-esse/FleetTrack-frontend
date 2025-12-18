import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AssignTireDialog({ open, onOpenChange, onConfirm, truckOptions, trailerOptions, tire }) {
    const [assignmentType, setAssignmentType] = useState("truck")
    const [selectedVehicleId, setSelectedVehicleId] = useState("")

    useEffect(() => {
        if (open) {
            setAssignmentType("truck")
            setSelectedVehicleId("")
        }
    }, [open])

    const handleConfirm = () => {
        onConfirm({
            assigned_to_type: assignmentType,
            assigned_to_id: selectedVehicleId
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Tire</DialogTitle>
                    <DialogDescription>
                        Assign {tire?.reference} to a vehicle.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Assignment Type</Label>
                        <Select value={assignmentType} onValueChange={setAssignmentType}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="truck">Truck</SelectItem>
                                <SelectItem value="trailer">Trailer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="vehicle">Select Vehicle</Label>
                        <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                            <SelectTrigger id="vehicle">
                                <SelectValue placeholder={`Select ${assignmentType}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {assignmentType === "truck" ? (
                                    truckOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))
                                ) : (
                                    trailerOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!selectedVehicleId}>Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
