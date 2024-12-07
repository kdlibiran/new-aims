'use client';

import { Device } from "@/lib/types";
import QRScanner from "@/components/QRScanner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RetireDevicePage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [deviceDetails, setDeviceDetails] = useState<Device | null>(null);
  const [retireReason, setRetireReason] = useState<'donated' | 'sold'>('donated');
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
    if (!deviceDetails) return;

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/devices/retire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: deviceDetails._id,
          retiredBy: formData.get('retiredBy'),
          reason: retireReason,
          value: retireReason === 'sold' ? Number(formData.get('value')) : undefined,
          recipient: formData.get('recipient'),
          notes: formData.get('notes')
        }),
      });

      if (!response.ok) throw new Error('Failed to retire device');
      
      toast({
        title: "Success",
        description: "Device retired successfully",
      });
      setDeviceDetails(null);
      setSelectedDeviceId(null);
    } catch (error) {
      console.error('Error retiring device:', error);
      toast({
        title: "Error",
        description: "Failed to retire device",
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
            <div className="bg-card p-6 rounded-lg shadow-lg border">
              <h2 className="text-2xl font-bold mb-4">Retire Device: {deviceDetails.name}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retiredBy">Retired By</Label>
                  <Input id="retiredBy" name="retiredBy" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Select 
                    value={retireReason} 
                    onValueChange={(value: 'donated' | 'sold') => setRetireReason(value)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="donated">Donated</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {retireReason === 'sold' && (
                  <div className="space-y-2">
                    <Label htmlFor="value">Sale Value</Label>
                    <Input 
                      id="value" 
                      name="value" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      required 
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input id="recipient" name="recipient" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" required />
                </div>
                <Button type="submit" className="w-full">Retire Device</Button>
              </form>
              <Button 
                onClick={() => setDeviceDetails(null)} 
                variant="outline"
                className="w-full mt-4"
              >
                Change Device
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Scan a QR code to retire a device
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 