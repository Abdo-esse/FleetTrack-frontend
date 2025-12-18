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
import { Textarea } from "@/components/ui/textarea"

export default function UpdateWearLevelDialog({ open, onOpenChange, onConfirm, tire }) {
    const [wearLevel, setWearLevel] = useState("")
    const [note, setNote] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (open && tire) {
            setWearLevel(tire.wearLevel || 0)
            setNote("")
            setError("")
        }
    }, [open, tire])

    const handleConfirm = () => {
        onConfirm(Number(wearLevel), note)
    }

    const handleChange = (e) => {
        const newValue = Number(e.target.value)
        setWearLevel(newValue)

        if (tire && newValue <= tire.wearLevel) {
            setError("New wear level must be greater than current wear level")
        } else if (newValue > 100) {
            setError("Wear level cannot exceed 100%")
        } else {
            setError("")
        }
    }

    const isValid = tire && Number(wearLevel) > tire.wearLevel && Number(wearLevel) <= 100

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Wear Level</DialogTitle>
                    <DialogDescription>
                        Update wear level for {tire?.reference}.
                        Current level: {tire?.wearLevel}%
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="wearLevel">New Wear Level (%)</Label>
                        <Input
                            id="wearLevel"
                            type="number"
                            value={wearLevel}
                            onChange={handleChange}
                            min={tire?.wearLevel ? tire.wearLevel + 1 : 0}
                            max={100}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            placeholder="Add a note about this update..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!isValid}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
