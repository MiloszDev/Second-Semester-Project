"use client";

import { UseFormReturn } from "react-hook-form";
import { InvoiceFormFullValues } from "@/lib/schemas";
import { calculateTotals, formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface Step4Props {
  form: UseFormReturn<InvoiceFormFullValues>;
}

export function Step4Review({ form }: Step4Props) {
  const values = form.getValues();
  const { client, invoice } = values;
  const { subtotal, vatTotal, total } = calculateTotals(invoice.items);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-xl font-semibold">Review & Confirm</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-semibold">{client.name}</p>
            <p>{client.companyName}</p>
            <p className="text-sm">{client.address}</p>
            <p className="text-sm">{client.email}</p>
            <p className="text-sm">VAT: {client.vatNumber}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number:</span>
              <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issue Date:</span>
              <span>{formatDate(invoice.issueDate)}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Due Date:</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Currency:</span>
              <span>{invoice.currency}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">VAT %</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                  <TableCell className="text-right">{item.vatRate}%</TableCell>
                   <TableCell className="text-right">
                    {formatCurrency(item.quantity * item.unitPrice, invoice.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col items-end space-y-2">
        <div className="flex justify-between w-full md:w-1/3 text-sm">
           <span className="text-muted-foreground">Subtotal:</span>
           <span>{formatCurrency(subtotal, invoice.currency)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/3 text-sm">
           <span className="text-muted-foreground">VAT Total:</span>
           <span>{formatCurrency(vatTotal, invoice.currency)}</span>
        </div>
        <Separator className="w-full md:w-1/3 my-2" />
        <div className="flex justify-between w-full md:w-1/3 font-bold text-lg">
           <span>Total:</span>
           <span>{formatCurrency(total, invoice.currency)}</span>
        </div>
      </div>
    </div>
  );
}
