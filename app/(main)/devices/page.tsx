import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { UserMenu } from "@/components/UserMenu";
import DevicesTable from "@/components/Devices/DevicesTable";
import { Device } from "@/lib/types";

export default async function DevicesPage() {
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    { token: convexAuthNextjsToken() },
  );
  
  const devices: Device[] = await fetchQuery(
    api.devices.list,
    {},
    { token: convexAuthNextjsToken() },
  );

  return (
    <main className="flex max-h-screen grow flex-col overflow-hidden">
      <div className="p-4 overflow-auto">
        <DevicesTable devices={devices} />
      </div>
    </main>
  );
}
