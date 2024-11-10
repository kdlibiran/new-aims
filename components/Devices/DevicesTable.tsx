import { Badge } from "@/components/ui/badge"
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
import { MoreHorizontal, Edit, Trash, History } from 'lucide-react'
import { DeviceStatus, Device } from '@/lib/types'
import { QRCodeModal } from './QRCodeModal'
import { AddDeviceModal } from './AddDeviceModal'
import { EditDeviceModal } from './EditDeviceModal'
import { DeviceHistoryModal } from "./DeviceHistoryModal"
import { DeleteDeviceModal } from "./DeleteDeviceModal"

function StatusBadge({ status }: { status: DeviceStatus }) {
  const styles = {
    available: 'bg-green-100 text-green-800',
    dispatched: 'bg-blue-100 text-blue-800',
    repair: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-purple-100 text-purple-800',
  }
  return <Badge className={styles[status]}>{status}</Badge>
}

export default function DevicesTable({ devices }: { devices: Device[] }) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Device Inventory</CardTitle>
        <AddDeviceModal />
      </CardHeader>
      <CardContent>
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
                <TableCell>{device.assignedTo || 'N/A'}</TableCell>
                <TableCell>{device.lastMaintenance ? new Date(device.lastMaintenance).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <EditDeviceModal device={device} />
                        <QRCodeModal device={device}/>
                        <DeviceHistoryModal device={device} />
                        <DeleteDeviceModal device={device} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}