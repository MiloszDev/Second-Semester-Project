"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceWithClient } from "@/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface InvoiceCardProps {
  children: React.ReactNode;
  className?: string;
}

const InvoiceCardContext = React.createContext<{ invoice: InvoiceWithClient } | null>(null);

function InvoiceCard({ children, className, invoice }: InvoiceCardProps & { invoice: InvoiceWithClient }) {
  return (
    <InvoiceCardContext.Provider value={{ invoice }}>
      <Card className={cn("overflow-hidden", className)}>
        {children}
      </Card>
    </InvoiceCardContext.Provider>
  );
}

function InvoiceCardHeader({ className }: { className?: string }) {
  const context = React.useContext(InvoiceCardContext);
  if (!context) throw new Error("InvoiceCard components must be used within InvoiceCard");
  const { invoice } = context;

  return (
    <CardHeader className={cn("bg-muted/50 p-4", className)}>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">#{invoice.invoiceNumber}</CardTitle>
        <Badge variant={
            invoice.status === 'paid' ? 'default' : 
            invoice.status === 'overdue' ? 'destructive' : 'secondary'
        }>
            {invoice.status}
        </Badge>
      </div>
      <CardDescription>
        Issued: {formatDate(invoice.issueDate)}
      </CardDescription>
    </CardHeader>
  );
}

function InvoiceCardClient({ className }: { className?: string }) {
  const context = React.useContext(InvoiceCardContext);
  if (!context) throw new Error("InvoiceCard components must be used within InvoiceCard");
  const { invoice } = context;

  return (
    <CardContent className={cn("p-4", className)}>
      <div className="grid gap-1">
        <div className="font-medium">{invoice.client.name}</div>
        <div className="text-sm text-muted-foreground">{invoice.client.companyName}</div>
        <div className="text-sm text-muted-foreground">{invoice.client.email}</div>
      </div>
    </CardContent>
  );
}

function InvoiceCardAmount({ className }: { className?: string }) {
    const context = React.useContext(InvoiceCardContext);
    if (!context) throw new Error("InvoiceCard components must be used within InvoiceCard");
    const { invoice } = context;
  
    return (
      <CardContent className={cn("p-4 pt-0", className)}>
        <div className="flex justify-between items-center border-t pt-2">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-lg font-bold">{formatCurrency(invoice.total, invoice.currency)}</span>
        </div>
      </CardContent>
    );
}

function InvoiceCardActions({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <CardFooter className={cn("p-4 pt-0 bg-muted/20 flex gap-2 justify-end", className)}>
            {children}
        </CardFooter>
    )
}

InvoiceCard.Header = InvoiceCardHeader;
InvoiceCard.Client = InvoiceCardClient;
InvoiceCard.Amount = InvoiceCardAmount;
InvoiceCard.Actions = InvoiceCardActions;

export { InvoiceCard };
