import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const { deviceId, retiredBy, reason, value, recipient, notes } = data;
  
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
      type: 'retire',
      date,
      user: retiredBy,
      notes,
      retireDetails: {
        reason,
        value: reason === 'sold' ? value : undefined,
        recipient,
      }
    });

    const {_id, ...currentDeviceWithoutId} = currentDevice;
    const updatedDevice = await fetchMutation(
      api.devices.update,
      { 
        _id: deviceId,
        device: {
          ...currentDeviceWithoutId,
          status: 'retired',
          assignedTo: 'Admin',
          history: history as any,
        }
      },
      { token: convexAuthNextjsToken() }
    );
    
    return NextResponse.json(updatedDevice);
  } catch (error) {
    console.error('Error retiring device:', error);
    return NextResponse.json({ error: 'Failed to retire device' }, { status: 500 });
  }
} 