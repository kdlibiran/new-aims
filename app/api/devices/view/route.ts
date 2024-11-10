import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
  }

  const device = await fetchQuery(
    api.devices.getById,
    { id },
    { token: convexAuthNextjsToken() }
  );

  return NextResponse.json(device);
} 