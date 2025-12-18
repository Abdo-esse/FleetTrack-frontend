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

export default function AssignDriverDialog({ open, onOpenChange, onConfirm, driverOptions, trip }) {
    const [selectedDriverId, setSelectedDriverId] = useState("")

    useEffect(() => {
        if (open) {
            setSelectedDriverId(trip?.driverId?._id || "")
        }
    }, [open, trip])

    const handleConfirm = () => {
        onConfirm({
            driverId: selectedDriverId
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Driver</DialogTitle>
                    <DialogDescription>
                        Assign a driver to trip from {trip?.origin} to {trip?.destination}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="driver">Select Driver</Label>
                        <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                            <SelectTrigger id="driver">
                                <SelectValue placeholder="Select a driver" />
                            </SelectTrigger>
                            <SelectContent>
                                {driverOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!selectedDriverId}>Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
