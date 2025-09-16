import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/global/Providers";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Event Management System - Atmiya University",
  description: "A comprehensive platform to manage events, registrations, and tickets for Atmiya University. Streamline your event management with our modern EMS solution.",
  keywords: ["event management", "university events", "registration system", "ticket management", "Atmiya University", "EMS"],
  authors: [{ name: "Atmiya University" }],
  creator: "Atmiya University",
  publisher: "Atmiya University",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://events.adsc-atmiya.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://events.adsc-atmiya.in',
    siteName: 'EMS - Atmiya University',
    title: 'Event Management System - Atmiya University',
    description: 'A comprehensive platform to manage events, registrations, and tickets for Atmiya University. Streamline your event management with our modern EMS solution.',
    images: [
      {
        url: '/images/og-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'EMS - Atmiya University Event Management System',
      },
      {
        url: '/images/og-thumbnail-square.png',
        width: 600,
        height: 600,
        alt: 'EMS - Atmiya University Event Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@atmiyauniversity',
    creator: '@atmiyauniversity',
    title: 'Event Management System - Atmiya University',
    description: 'A comprehensive platform to manage events, registrations, and tickets for Atmiya University.',
    images: ['/images/og-thumbnail.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
