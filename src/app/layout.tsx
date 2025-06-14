import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ClientLayout from "@/components/client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Girnar",
  description: "Best Hostel in IIT Delhi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id='root'
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
