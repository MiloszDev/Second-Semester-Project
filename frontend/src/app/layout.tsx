import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "Professional invoice generator for freelancers",
};

import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Header />
            <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
