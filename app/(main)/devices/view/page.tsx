'use client';

import { Device } from "@/lib/types";
import QRScanner from "@/components/QRScanner";
import DeviceDetails from "@/components/DeviceDetails";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DevicesPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [deviceDetails, setDeviceDetails] = useState<Device | null>(null);

  const handleQRCodeScanned = async (scannedId: string) => {
    setSelectedDeviceId(scannedId);
    try {
      // Fetch device details through the API route
      const response = await fetch(`/api/devices/view?id=${scannedId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch device');
      }
      const device = await response.json();
      setDeviceDetails(device as Device);
    } catch (error) {
      console.error('Error fetching device:', error);
      setDeviceDetails(null);
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
            <>
              <DeviceDetails device={deviceDetails} />
              <Button onClick={() => setDeviceDetails(null) } className="w-full mt-4">Change Device</Button>
              </>
          ) : (
            <div className="text-center text-gray-600">
              Scan a QR code to view device details
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
