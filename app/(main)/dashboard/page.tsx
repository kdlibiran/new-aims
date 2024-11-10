import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { UserMenu } from "@/components/UserMenu";

export default async function DashboardPage() {
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    { token: convexAuthNextjsToken() },
  );
  return (
    <main className="flex max-h-screen grow flex-col overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold">Welcome to AIMS! TODO: Add dashboard content</h2>
      </div>
    </main>
  );
}
