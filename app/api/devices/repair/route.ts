import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const { deviceId, repairDescription, repairCost, repairedBy } = data;
  
  try {
    const currentDevice = await fetchQuery(
      api.devices.getById,
      { id: deviceId },
      { token: convexAuthNextjsToken() }
    );

    if (!currentDevice) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const history = [...currentDevice.history];
    const date = new Date().toISOString();
    
    history.push({
      type: 'repair',
      date,
      user: repairedBy,
      notes: repairDescription,
      repairDetails: {
        issue: repairDescription,
        solution: 'Pending',
        technician: repairedBy,
        cost: Number(repairCost),
      }
    });

    const {_id, ...currentDeviceWithoutId} = currentDevice;
    const updatedDevice = await fetchMutation(
      api.devices.update,
      { 
        _id: deviceId,
        device: {
          ...currentDeviceWithoutId,
          status: 'repair',
          history: history as any,
        }
      },
      { token: convexAuthNextjsToken() }
    );
    
    return NextResponse.json(updatedDevice);
  } catch (error) {
    console.error('Error repairing device:', error);
    return NextResponse.json({ error: 'Failed to set device for repair' }, { status: 500 });
  }
} 