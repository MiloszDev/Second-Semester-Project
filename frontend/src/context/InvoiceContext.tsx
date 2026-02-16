"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Invoice, InvoiceFormData, InvoiceWithClient } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useClients } from './ClientContext';

interface InvoiceContextType {
  invoices: InvoiceWithClient[];
  addInvoice: (data: Omit<InvoiceFormData, 'clientId' | 'status'>, clientId: string) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => InvoiceWithClient | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { clients } = useClients();

  // Load from localStorage on mount
  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      try {
        setInvoices(JSON.parse(storedInvoices));
      } catch (e) {
        console.error('Failed to parse invoices from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (data: Omit<InvoiceFormData, 'clientId' | 'status'>, clientId: string) => {
    // Calculate totals if not provided or just trust input?
    // The InvoiceFormData doesn't have totals. We should calculate them.
    const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const vatTotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
    const total = subtotal + vatTotal;

    const newInvoice: Invoice = {
      ...data,
      id: uuidv4(),
      clientId,
      subtotal,
      vatTotal,
      total,
      status: 'draft', // Default status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...data, updatedAt: new Date().toISOString() } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const getInvoice = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return undefined;
    const client = clients.find(c => c.id === inv.clientId);
    // If client deleted, we might have issues. For now assume client exists or handle gracefully.
    // We need to return InvoiceWithClient.
    // If client is missing, we should probably mock it or return undefined/null client but type says strict.
    // Let's assume for now we can find logic.
    if (!client) {
        // returning with a dummy client or just standard invoice but type mismatch?
        // Let's skip valid check for strictness here for simplicity or handle it.
         return undefined; 
    }
    return { ...inv, client } as InvoiceWithClient;
  };

  // Compute InvoiceWithClient list
  const invoicesWithClients = invoices.map(inv => {
      const client = clients.find(c => c.id === inv.clientId);
      if (!client) return null;
      return { ...inv, client };
  }).filter((i): i is InvoiceWithClient => i !== null);

  return (
    <InvoiceContext.Provider
      value={{ invoices: invoicesWithClients, addInvoice, updateInvoice, deleteInvoice, getInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}
