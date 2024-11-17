import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const { deviceId, borrowedBy, expectedReturnDate, purpose } = data;
  
  try {
    // First get the current device to access its history
    const currentDevice = await fetchQuery(
      api.devices.getById,
      { id: deviceId },
      { token: convexAuthNextjsToken() }
    );

    if (!currentDevice) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Create new history entry
    const history = [...currentDevice.history];
    const date = new Date().toISOString();
    
    history.push({
      type: 'borrow',
      date,
      user: borrowedBy,
      notes: purpose || `Borrowed until ${expectedReturnDate}`,
    });
    const {_id, ...currentDeviceWithoutId} = currentDevice;
    // Update device with new status and history
    const updatedDevice = await fetchMutation(
      api.devices.update,
      { 
        _id: deviceId,
        device: {
          ...currentDeviceWithoutId,
          status: 'dispatched',
          assignedTo: borrowedBy,
          notes: purpose || `Borrowed until ${expectedReturnDate}`,
          history: history as any,
        }
      },
      { token: convexAuthNextjsToken() }
    );
    
    return NextResponse.json(updatedDevice);
  } catch (error) {
    console.error('Error borrowing device:', error);
    return NextResponse.json({ error: 'Failed to borrow device' }, { status: 500 });
  }
} 