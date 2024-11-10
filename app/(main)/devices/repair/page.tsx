'use client';

import { Device } from "@/lib/types";
import QRScanner from "@/components/QRScanner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function RepairDevicePage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [deviceDetails, setDeviceDetails] = useState<Device | null>(null);
  const { toast } = useToast();

  const handleQRCodeScanned = async (scannedId: string) => {
    setSelectedDeviceId(scannedId);
    try {
      const response = await fetch(`/api/devices/view?id=${scannedId}`);
      if (!response.ok) throw new Error('Failed to fetch device');
      const device = await response.json();
      setDeviceDetails(device as Device);
    } catch (error) {
      console.error('Error fetching device:', error);
      setDeviceDetails(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/devices/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: deviceDetails?._id,
          repairDescription: formData.get('repairDescription'),
          repairCost: formData.get('repairCost'),
          repairedBy: formData.get('repairedBy')
        }),
      });

      if (!response.ok) throw new Error('Failed to record repair');
      
      toast({
        title: "Success",
        description: "Device repair recorded successfully",
      });
      setDeviceDetails(null);
      setSelectedDeviceId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record repair",
        variant: "destructive"
      });
    }
  };

  const handleQRCodeError = (errorMessage: string) => {
    console.error('QR Code Error:', errorMessage);
  };

  return (
    <main className="flex h-screen w-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            {!deviceDetails ? <QRScanner onScan={handleQRCodeScanned} onError={handleQRCodeError} /> : null}
          </div>
          {deviceDetails ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Repair Device: {deviceDetails.name}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repairDescription">Repair Description</Label>
                  <Input id="repairDescription" name="repairDescription" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repairCost">Repair Cost</Label>
                  <Input 
                    id="repairCost" 
                    name="repairCost" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repairedBy">Repaired By</Label>
                  <Input id="repairedBy" name="repairedBy" required />
                </div>
                <Button type="submit" className="w-full">Record Repair</Button>
              </form>
              <Button onClick={() => setDeviceDetails(null)} className="w-full mt-4">Change Device</Button>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              Scan a QR code to record a device repair
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 