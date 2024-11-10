import { AppSidebar } from "@/components/app-sidebar";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";


export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          {children}
        </div>
      </SidebarProvider>
    </ConvexClientProvider>
  );
}



