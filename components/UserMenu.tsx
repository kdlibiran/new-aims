"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
export function UserMenu({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full border border-foreground">
            <PersonIcon className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuLabel>{children}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-foreground"/>
          <DropdownMenuLabel className="flex items-center gap-2 py-0 font-normal">
            Theme
            <ThemeToggle />
          </DropdownMenuLabel>
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
      {children}

    </div>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <DropdownMenuItem onClick={ () => {
      void signOut();
      router.push("/login");
    }}>Sign out</DropdownMenuItem>
  );
}
