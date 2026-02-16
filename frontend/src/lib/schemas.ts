import { z } from 'zod';

// Regex for basic VAT validation (simplified, can be expanded per country)
// This regex allows alphanumeric characters, ensuring length constraints typical for EU VAT numbers.
const vatRegex = /^[A-Z]{2}[A-Z0-9]{2,12}$/;

export const ClientSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  vatNumber: z.string().regex(vatRegex, { message: 'Invalid VAT number format (e.g., DE123456789).' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
});

export const LineItemSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1.' }),
  unitPrice: z.number().min(0, { message: 'Unit price cannot be negative.' }),
  vatRate: z.number().min(0, { message: 'VAT rate cannot be negative.' }).max(100, { message: 'VAT rate cannot exceed 100%.' }),
});

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, { message: 'Invoice number is required.' }),
  issueDate: z.date(),
  dueDate: z.date(),
  currency: z.string().min(1, { message: 'Currency is required.' }),
  items: z.array(LineItemSchema).min(1, { message: 'At least one line item is required.' }),
}).refine((data) => {
  return data.dueDate >= data.issueDate;
}, {
  message: 'Due date must be after or on the same day as the issue date.',
  path: ['dueDate'],
});

export const InvoiceFormSchema = z.object({
  client: ClientSchema,
  invoice: InvoiceSchema,
});

export type ClientFormValues = z.infer<typeof ClientSchema>;
export type LineItemFormValues = z.infer<typeof LineItemSchema>;
export type InvoiceFormValues = z.infer<typeof InvoiceSchema>;
export type InvoiceFormFullValues = z.infer<typeof InvoiceFormSchema>;
