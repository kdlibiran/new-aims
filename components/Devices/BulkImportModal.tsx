"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DeviceStatus } from "@/lib/types";

interface DeviceImport {
  name: string;
  serialNumber: string;
  status?: string;
  assignedTo?: string;
}

const validStatuses: DeviceStatus[] = ['available', 'dispatched', 'repair', 'retired', 'missing'];

export function BulkImportModal() {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const createDevices = useMutation(api.devices.create);

  const validateStatus = (status: string): DeviceStatus => {
    const normalizedStatus = status.toLowerCase();
    if (validStatuses.includes(normalizedStatus as DeviceStatus)) {
      return normalizedStatus as DeviceStatus;
    }
    return 'available';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<DeviceImport>(worksheet);

      // Validate and transform the data
      const devices = jsonData.map(row => ({
        name: row.name,
        serialNumber: row.serialNumber,
        status: validateStatus(row.status || 'available'),
        assignedTo: row.status?.toLowerCase() === 'dispatched' 
          ? (row.assignedTo || 'Unassigned')
          : 'Admin',
        history: []
      }));

      // Create devices in bulk
      for (const device of devices) {
        await createDevices({ device });
      }

      toast({
        title: "Success",
        description: `Imported ${devices.length} devices successfully`,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error importing devices:', error);
      toast({
        title: "Error",
        description: "Failed to import devices. Please check your Excel file format.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: 'Example Laptop',
        serialNumber: 'SN123456',
        status: 'available',
        assignedTo: 'Admin'
      }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devices");

    // Add validation rules to the template
    const validationNote = XLSX.utils.aoa_to_sheet([
      ['Note: Valid status values are:'],
      ['- available'],
      ['- dispatched'],
      ['- repair'],
      ['- retired'],
      ['- missing'],
      [''],
      ['When status is "available" or "repair", assignedTo will be set to "Admin"'],
    ]);
    XLSX.utils.book_append_sheet(wb, validationNote, "Instructions");

    XLSX.writeFile(wb, "device_import_template.xlsx");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Upload className="mr-2 h-4 w-4" />
          Import Devices
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Devices</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple devices at once.
            Download the template first to see the required format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
          >
            Download Template
          </Button>
          <div className="grid gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isUploading && (
              <p className="text-sm text-muted-foreground">
                Uploading devices... Please wait.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 