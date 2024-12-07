import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, FileDown, Upload, Plus } from 'lucide-react'
import { Device } from '@/lib/types'
import { QRCodeModal } from './QRCodeModal'
import { AddDeviceModal } from './AddDeviceModal'
import { EditDeviceModal } from './EditDeviceModal'
import { DeviceHistoryModal } from "./DeviceHistoryModal"
import { DeleteDeviceModal } from "./DeleteDeviceModal"
import { BulkImportModal } from "./BulkImportModal"
import { GenerateReportModal } from "./GenerateReportModal"
import { StatusBadge } from "@/components/ui/status-badge"

export default function DevicesTable({ devices }: { devices: Device[] }) {
  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">Device Inventory</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your devices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GenerateReportModal />
          <BulkImportModal />
          <AddDeviceModal />

        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Serial No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device._id}>
                  <TableCell className="font-medium">{device.serialNumber}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={device.status} />
                  </TableCell>
                  <TableCell>{device.assignedTo}</TableCell>
                  <TableCell>{formatDate(device.lastMaintenance)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white ">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <EditDeviceModal device={device} />
                        <QRCodeModal device={device}/>
                        <DeviceHistoryModal device={device} />
                        <DropdownMenuSeparator />
                        <DeleteDeviceModal device={device} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}