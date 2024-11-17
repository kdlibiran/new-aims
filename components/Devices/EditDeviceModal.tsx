'use client'

import { useState } from "react";
import { Device, DeviceHistory, DeviceStatus } from "@/lib/types";
import { Edit } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export function EditDeviceModal({ device }: { device: Device }) {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<DeviceStatus>(device.status)
    const updateDevice = useMutation(api.devices.update)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        
        const history = [...device.history]
        const date = new Date().toISOString()

        if (status === 'dispatched') {
            history.push({
                type: 'borrow',
                date,
                user: formData.get('assignedTo') as string,
                notes: formData.get('notes') as string
            })
        } else if (status === 'repair') {
            history.push({
                type: 'repair',
                date,
                user: formData.get('technician') as string,
                notes: formData.get('notes') as string,
                repairDetails: {
                    issue: formData.get('issue') as string,
                    solution: formData.get('solution') as string,
                    cost: Number(formData.get('cost')),
                    technician: formData.get('technician') as string
                }
            })
        } else if (status === 'maintenance') {
            history.push({
                type: 'maintenance',
                date,
                user: formData.get('maintainedBy') as string,
                notes: `${formData.get('maintenanceType') as string} maintenance: ${formData.get('notes') as string}`,
            })
        }

        try {
            const updatedDevice = {
                name: device.name,
                serialNumber: device.serialNumber,
                status,
                assignedTo: status === 'dispatched' ? formData.get('assignedTo') as string : undefined,
                notes: formData.get('notes') as string,
                history,
                lastMaintenance: status === 'maintenance' ? new Date().toISOString() : device.lastMaintenance
            }

            await updateDevice({
                _id: device._id as Id<"devices">,
                device: updatedDevice as any
            })
            toast({
                title: "Success",
                description: "Device updated successfully",
            })
            setOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update device",
                variant: "destructive"
            })
        }
    }

    return (
        <>
            <DropdownMenuItem onSelect={(e) => {
                e.preventDefault()
                setOpen(true)
            }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Device</DialogTitle>
                        <DialogDescription>
                            Update device information and status.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select 
                                name="status" 
                                value={status} 
                                onValueChange={(value: DeviceStatus) => setStatus(value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-background">
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="dispatched">Dispatched</SelectItem>
                                    <SelectItem value="repair">Repair</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {status === 'dispatched' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="assignedTo" className="text-right">
                                    Assigned To
                                </Label>
                                <Input 
                                    id="assignedTo" 
                                    name="assignedTo" 
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        )}

                        {status === 'repair' && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="issue" className="text-right">
                                        Issue
                                    </Label>
                                    <Input 
                                        id="issue" 
                                        name="issue" 
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="solution" className="text-right">
                                        Solution
                                    </Label>
                                    <Input 
                                        id="solution" 
                                        name="solution" 
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="cost" className="text-right">
                                        Cost
                                    </Label>
                                    <Input 
                                        id="cost" 
                                        name="cost" 
                                        type="number"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="technician" className="text-right">
                                        Technician
                                    </Label>
                                    <Input 
                                        id="technician" 
                                        name="technician" 
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {status === 'maintenance' && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="maintenanceType" className="text-right">
                                        Maintenance Type
                                    </Label>
                                    <Input 
                                        id="maintenanceType" 
                                        name="maintenanceType" 
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="maintenanceDate" className="text-right">
                                        Maintenance Date
                                    </Label>
                                    <Input 
                                        id="maintenanceDate" 
                                        name="maintenanceDate" 
                                        type="date"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="maintainedBy" className="text-right">
                                        Maintained By
                                    </Label>
                                    <Input 
                                        id="maintainedBy" 
                                        name="maintainedBy" 
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Input 
                                id="notes" 
                                name="notes" 
                                className="col-span-3"
                            />
                        </div>

                        <Button type="submit" className="mt-4 border">
                            Save Changes
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}