"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { FileDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as XLSX from 'xlsx';
import { Device, DeviceHistory } from '@/lib/types';

type ReportType = 'all' | 'available' | 'dispatched' | 'repair' | 'retired' | 'missing';

export function GenerateReportModal() {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('all');
  const devices = useQuery(api.devices.list);

  const generateReport = () => {
    if (!devices) return;

    const filteredDevices = reportType === 'all' 
      ? devices 
      : devices.filter(device => device.status === reportType);

    const reportData = filteredDevices.map(device => {
      const latestHistory = device.history[device.history.length - 1];
      return {
        'Serial Number': device.serialNumber,
        'Name': device.name,
        'Status': device.status,
        'Assigned To': device.assignedTo,
        'Last Maintenance': device.lastMaintenance 
          ? new Date(device.lastMaintenance).toLocaleDateString() 
          : 'N/A',
        'Last Activity Type': latestHistory?.type || 'N/A',
        'Last Activity Date': latestHistory 
          ? new Date(latestHistory.date).toLocaleDateString() 
          : 'N/A',
        'Last Activity User': latestHistory?.user || 'N/A',
      };
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devices");

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `device_report_${reportType}_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Device Report</DialogTitle>
          <DialogDescription>
            Select the type of report you want to generate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={reportType}
            onValueChange={(value: ReportType) => setReportType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="available">Available Devices</SelectItem>
              <SelectItem value="dispatched">Dispatched Devices</SelectItem>
              <SelectItem value="repair">Devices in Repair</SelectItem>
              <SelectItem value="retired">Retired Devices</SelectItem>
              <SelectItem value="missing">Missing Devices</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport}>
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 