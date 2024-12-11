import {
  LayoutDashboard,
  Laptop,
  Plus,
  Eye,
  Pencil,
  Handshake,
  Wrench,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserMenu } from "@/components/UserMenu";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Devices",
    url: "/devices",
    icon: Laptop,
  },
  {
    title: "Device Actions",
    icon: Plus,
    children: [
      {
        title: "View Device",
        url: "/devices/view",
        icon: Eye,
      },
      {
        title: "Borrow Device",
        url: "/devices/borrow",
        icon: Handshake,
      },
      {
        title: "Return Device",
        url: "/devices/return",
        icon: Handshake,
      },
      {
        title: "Repair Device",
        url: "/devices/repair",
        icon: Wrench,
      },
    ],
  },
];

export async function AppSidebar() {
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    { token: convexAuthNextjsToken() },
  );

  return (
    <Sidebar>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel>AIMS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.children ? (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarGroupLabel
                      asChild
                      className="group/label text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <CollapsibleTrigger>
                        <item.icon />
                        {item.title}{" "}
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                      <SidebarMenu>
                        {item.children.map((child) => (
                          <SidebarMenuItem key={child.title}>
                            <SidebarMenuButton asChild>
                              <a href={child.url}>
                                <child.icon />
                                <span>{child.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-foreground/10 flex-row justify-center items-center">
        <UserMenu>{viewer.email}</UserMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
