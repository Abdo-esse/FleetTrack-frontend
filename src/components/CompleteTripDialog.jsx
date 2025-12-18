import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function CompleteTripDialog({ open, onOpenChange, onConfirm, trip }) {
    const [arrivalMileage, setArrivalMileage] = useState("")
    const [fuelConsumed, setFuelConsumed] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (open && trip) {
            setArrivalMileage(trip.departureMileage ? trip.departureMileage + 1 : "")
            setFuelConsumed("")
            setError("")
        }
    }, [open, trip])

    const handleConfirm = () => {
        onConfirm({
            arrivalMileage: Number(arrivalMileage),
            fuelConsumedLiters: Number(fuelConsumed)
        })
    }

    const validate = () => {
        if (trip && Number(arrivalMileage) <= trip.departureMileage) {
            setError("Arrival mileage must be greater than departure mileage")
            return false
        }
        if (Number(fuelConsumed) < 0) {
            setError("Fuel consumed cannot be negative")
            return false
        }
        setError("")
        return true
    }

    useEffect(() => {
        validate()
    }, [arrivalMileage, fuelConsumed])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Trip</DialogTitle>
                    <DialogDescription>
                        Enter trip details for {trip?.truckId?.registrationNumber || "Truck"}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="arrivalMileage">Arrival Mileage</Label>
                        <Input
                            id="arrivalMileage"
                            type="number"
                            value={arrivalMileage}
                            onChange={(e) => setArrivalMileage(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fuelConsumed">Fuel Consumed (Liters)</Label>
                        <Input
                            id="fuelConsumed"
                            type="number"
                            value={fuelConsumed}
                            onChange={(e) => setFuelConsumed(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!arrivalMileage || !fuelConsumed || !!error}
                    >
                        Complete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
