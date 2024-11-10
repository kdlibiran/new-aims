'use client'

import { useState, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { DeviceStatus } from "@/lib/types";

export function AddDeviceModal() {
    const addDevice = useMutation(api.devices.create)
    const [open, setOpen] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
  
    const createDevice = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      console.log(formData)
      await addDevice({
        device: {
          name: formData.get('name') as string,
          serialNumber: formData.get('serialNumber') as string,
          status: formData.get('status') as DeviceStatus,
          history: [],
        }
      })
      formRef.current?.reset()
      setOpen(false)
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Enter the details of the new device to add it to the system.
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={createDevice} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serialNumber" className="text-right">
                Serial Number
              </Label>
              <Input id="serialNumber" name="serialNumber" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="col-span-3 bg-background">
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className='bg-primary text-primary-foreground border'>
              Add Device
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }