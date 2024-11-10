'use client'

import { useState } from "react";
import { Device } from "@/lib/types";
import { Trash } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export function DeleteDeviceModal({ device }: { device: Device }) {
    const [open, setOpen] = useState(false)
    const deleteDevice = useMutation(api.devices.remove)
    const { toast } = useToast()

    const handleDelete = async () => {
        try {
            await deleteDevice({
                _id: device._id as Id<"devices">
            })
            toast({
                title: "Success",
                description: "Device deleted successfully",
            })
            setOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete device",
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
                <Trash className="mr-2 h-4 w-4" />
                Delete
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Device</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {device.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
