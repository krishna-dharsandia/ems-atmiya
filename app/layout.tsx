import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavigationBar from "@/components/global/navigation-bar/NavigationBar";
import { Providers } from "@/components/global/Providers";

export const metadata: Metadata = {
  title: "Event Management System",
  description: "A platform to manage events and tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NavigationBar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
