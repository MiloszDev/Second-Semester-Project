"use client";

import { ClientProvider } from '@/context/ClientContext';
import { Toaster } from "@/components/ui/sonner"
import { InvoiceProvider } from '@/context/InvoiceContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <InvoiceProvider>
        {children}
        <Toaster />
      </InvoiceProvider>
    </ClientProvider>
  );
}
