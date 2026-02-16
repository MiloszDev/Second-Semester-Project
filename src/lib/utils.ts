import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(dateStr: string | Date) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function calculateTotals(items: { quantity: number; unitPrice: number; vatRate: number }[]) {
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const vatTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
  const total = subtotal + vatTotal;
  
  return {
    subtotal,
    vatTotal,
    total
  };
}
