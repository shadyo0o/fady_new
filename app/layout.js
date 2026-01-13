import { Inter } from "next/font/google";
import "./globals.css";
import { Viewport, Metadata } from 'next';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fady's Vaccines",
  description: "Child vaccination tracker and health assistant",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#4A90E2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import DashboardLayout from "@/components/DashboardLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <DashboardLayout>
            {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
