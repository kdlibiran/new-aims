'use client';

import { Device } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CalendarDays, User, History } from "lucide-react";

interface DeviceDetailsProps {
  device: Device;
}

export default function DeviceDetails({ device }: DeviceDetailsProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLatestHistory = () => {
    if (!device.history || device.history.length === 0) return null;
    return device.history[device.history.length - 1];
  };

  const latestHistory = getLatestHistory();

  return (
    <Card className="bg-card p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Device Details</h2>
        <StatusBadge status={device.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Name</p>
          <p className="font-medium">{device.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Serial Number</p>
          <p className="font-medium font-mono">{device.serialNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Assigned To</p>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">{device.assignedTo}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Last Maintenance</p>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">{formatDate(device.lastMaintenance)}</p>
          </div>
        </div>
      </div>

      {latestHistory && (
        <div className="border-t border-border pt-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Latest Activity</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <StatusBadge 
                status={latestHistory.type === 'maintenance' ? 'repair' : latestHistory.type as any} 
                className="capitalize"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="font-medium">{formatDate(latestHistory.date)}</p>
            </div>
            {latestHistory.user && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">User</p>
                <p className="font-medium">{latestHistory.user}</p>
              </div>
            )}
            {latestHistory.receivedBy && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Received By</p>
                <p className="font-medium">{latestHistory.receivedBy}</p>
              </div>
            )}
            {latestHistory.notes && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="font-medium">{latestHistory.notes}</p>
              </div>
            )}
            {latestHistory.repairDetails && (
              <div className="col-span-2 bg-muted p-3 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Issue</p>
                  <p className="font-medium">{latestHistory.repairDetails.issue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Solution</p>
                  <p className="font-medium">{latestHistory.repairDetails.solution}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-medium">${latestHistory.repairDetails.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Technician</p>
                    <p className="font-medium">{latestHistory.repairDetails.technician}</p>
                  </div>
                </div>
              </div>
            )}
            {latestHistory.retireDetails && (
              <div className="col-span-2 bg-muted p-3 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium capitalize">{latestHistory.retireDetails.reason}</p>
                </div>
                {latestHistory.retireDetails.value && (
                  <div>
                    <p className="text-sm text-muted-foreground">Value</p>
                    <p className="font-medium">${latestHistory.retireDetails.value.toFixed(2)}</p>
                  </div>
                )}
                {latestHistory.retireDetails.recipient && (
                  <div>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                    <p className="font-medium">{latestHistory.retireDetails.recipient}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
} 