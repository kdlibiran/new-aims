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
        const date = new Date().toISOString()
        const history = [...device.history]

        // Add history entry based on status change
        if (status !== device.status) {
            if (status === 'repair') {
                history.push({
                    type: 'repair',
                    date,
                    user: formData.get('technician') as string,
                    notes: formData.get('notes') as string,
                    repairDetails: {
                        issue: formData.get('issue') as string,
                        solution: formData.get('solution') as string,
                        cost: Number(formData.get('cost')),
                        technician: formData.get('technician') as string,
                    }
                })
            } else if (status === 'retired') {
                history.push({
                    type: 'retire',
                    date,
                    user: formData.get('retiredBy') as string,
                    notes: formData.get('notes') as string,
                    retireDetails: {
                        reason: formData.get('retireReason') as 'donated' | 'sold',
                        value: formData.get('value') ? Number(formData.get('value')) : undefined,
                        recipient: formData.get('recipient') as string,
                    }
                })
            } else if (status === 'missing') {
                history.push({
                    type: 'missing',
                    date,
                    user: formData.get('reportedBy') as string,
                    notes: formData.get('notes') as string,
                })
            }
        }

        try {
            await updateDevice({
                _id: device._id,
                device: {
                    status,
                    assignedTo: status === 'dispatched' ? (formData.get('assignedTo') as string) : 'Admin',
                    notes: formData.get('notes') as string,
                    history: history as any,
                }
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
                                value={status} 
                                onValueChange={(value: DeviceStatus) => setStatus(value)}
                            >
                                <SelectTrigger className="col-span-3 bg-background">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-background">
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="dispatched">Dispatched</SelectItem>
                                    <SelectItem value="repair">In Repair</SelectItem>
                                    <SelectItem value="retired">Retired</SelectItem>
                                    <SelectItem value="missing">Missing</SelectItem>
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
                                        step="0.01"
                                        min="0"
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

                        {status === 'retired' && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="retiredBy" className="text-right">
                                        Retired By
                                    </Label>
                                    <Input 
                                        id="retiredBy" 
                                        name="retiredBy" 
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="retireReason" className="text-right">
                                        Reason
                                    </Label>
                                    <Select name="retireReason" defaultValue="donated">
                                        <SelectTrigger className="col-span-3 bg-background">
                                            <SelectValue placeholder="Select reason" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background">
                                            <SelectItem value="donated">Donated</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="value" className="text-right">
                                        Value
                                    </Label>
                                    <Input 
                                        id="value" 
                                        name="value" 
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="recipient" className="text-right">
                                        Recipient
                                    </Label>
                                    <Input 
                                        id="recipient" 
                                        name="recipient" 
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {status === 'missing' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reportedBy" className="text-right">
                                    Reported By
                                </Label>
                                <Input 
                                    id="reportedBy" 
                                    name="reportedBy" 
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Input 
                                id="notes" 
                                name="notes" 
                                className="col-span-3"
                                required
                            />
                        </div>

                        <Button type="submit" className="mt-4">
                            Save Changes
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}