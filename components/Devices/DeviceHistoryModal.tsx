'use client'

import { useState } from "react";
import { Device, DeviceHistory } from "@/lib/types";
import { History } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function DeviceHistoryModal({ device }: { device: Device }) {
    const [open, setOpen] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const getHistoryTypeBadgeStyle = (type: string) => {
        switch (type) {
            case 'borrow':
                return 'bg-blue-100 text-blue-800'
            case 'repair':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <>
            <DropdownMenuItem onSelect={(e) => {
                e.preventDefault()
                setOpen(true)
            }}>
                <History className="mr-2 h-4 w-4" />
                View History
            </DropdownMenuItem>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Device History</DialogTitle>
                        <DialogDescription>
                            History of all actions performed on {device.name} ({device.serialNumber})
                        </DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {device.history.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{formatDate(entry.date)}</TableCell>
                                    <TableCell>
                                        <Badge className={getHistoryTypeBadgeStyle(entry.type)}>
                                            {entry.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{entry.user}</TableCell>
                                    <TableCell>{entry.notes}</TableCell>
                                    <TableCell>
                                        {entry.repairDetails && (
                                            <div className="text-sm">
                                                <p><strong>Issue:</strong> {entry.repairDetails.issue}</p>
                                                <p><strong>Solution:</strong> {entry.repairDetails.solution}</p>
                                                <p><strong>Cost:</strong> ${entry.repairDetails.cost}</p>
                                                <p><strong>Technician:</strong> {entry.repairDetails.technician}</p>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </>
    )
}