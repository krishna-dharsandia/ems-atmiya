import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
