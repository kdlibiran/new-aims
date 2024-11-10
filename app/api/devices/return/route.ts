import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const { deviceId, returnedBy, notes } = data;
  
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
      type: 'return',
      date,
      user: returnedBy,
      notes: notes,
    });

    const updatedDevice = await fetchMutation(
      api.devices.update,
      { 
        _id: deviceId,
        device: {
          ...currentDevice,
          status: 'available',
          assignedTo: undefined,
          history: history as any,
        }
      },
      { token: convexAuthNextjsToken() }
    );
    
    return NextResponse.json(updatedDevice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to return device' }, { status: 500 });
  }
} 