export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  vatNumber: string;
  address: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // Percentage, e.g., 20 for 20%
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string; // ISO Date string
  dueDate: string; // ISO Date string
  currency: string;
  status: InvoiceStatus;
  items: LineItem[];
  subtotal: number;
  vatTotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceWithClient = Invoice & { client: Client };

// Utility Types
export type ClientFormData = Omit<Client, 'id' | 'createdAt'>;
export type InvoiceFormData = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'subtotal' | 'vatTotal' | 'total'>;

// Type Guard
export function isPaid(invoice: Invoice): invoice is Invoice & { status: 'paid' } {
  return invoice.status === 'paid';
}
