import { Invoice } from "@/types";

// Simulated database
let invoicesStore: Invoice[] = [];

// Function Overloads
export function getInvoice(id: string): Invoice | undefined;
export function getInvoice(): Invoice[];
export function getInvoice(id?: string): Invoice | Invoice[] | undefined {
  if (id) {
    return invoicesStore.find((inv) => inv.id === id);
  }
  return invoicesStore;
}

// Utility to populate store for demo compatibility with Context
export function setStore(invoices: Invoice[]) {
    invoicesStore = invoices;
}
