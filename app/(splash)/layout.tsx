import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
export default function SplashPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider forcedTheme="light">
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex grow flex-col">{children}</main>
      </div>
    </ThemeProvider>
  );
}
