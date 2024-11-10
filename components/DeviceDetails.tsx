'use client';

import { Device } from "@/lib/types";

interface DeviceDetailsProps {
  device: Device;
}

export default function DeviceDetails({ device }: DeviceDetailsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Device Details</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">ID:</span> {device._id}</p>
        <p><span className="font-semibold">Name:</span> {device.name}</p>
        <p><span className="font-semibold">Status:</span> {device.status}</p>
      </div>
    </div>
  );
} 