'use client';

import { Device } from "@/lib/types";
import QRScanner from "@/components/QRScanner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ReturnDevicePage() {
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
      const response = await fetch('/api/devices/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: deviceDetails?._id,
          returnCondition: formData.get('returnCondition'),
          notes: formData.get('notes')
        }),
      });

      if (!response.ok) throw new Error('Failed to return device');
      
      toast({
        title: "Success",
        description: "Device returned successfully",
      });
      setDeviceDetails(null);
      setSelectedDeviceId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to return device",
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
              <h2 className="text-2xl font-bold mb-4">Return Device: {deviceDetails.name}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="returnCondition">Return Condition</Label>
                  <Input id="returnCondition" name="returnCondition" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" required />
                </div>
                <Button type="submit" className="w-full">Submit</Button>
              </form>
              <Button onClick={() => setDeviceDetails(null) } className="w-full mt-4">Change Device</Button>
            </div>

          ) : (
            <div className="text-center text-gray-600">
              Scan a QR code to return a device
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 