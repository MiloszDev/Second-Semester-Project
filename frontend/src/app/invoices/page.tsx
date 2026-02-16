"use client";

import { useInvoices } from "@/context/InvoiceContext";
import { InvoiceCard } from "@/components/invoices/InvoiceCard";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InvoicesPage() {
  const { invoices } = useInvoices();

  const handleDownloadPDF = async (invoice: any) => {
    try {
        const response = await fetch("/api/generate-pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ invoice }),
        });

        if (!response.ok) throw new Error("Failed to generate PDF");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoice.invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("PDF Downloaded successfully");
    } catch (error) {
        console.error(error);
        toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Link>
        </Button>
      </div>

      {invoices.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
              <h3 className="text-lg font-medium">No invoices yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Create your first invoice to get started.</p>
              <Button asChild className="mt-4">
                <Link href="/invoices/new">Create Invoice</Link>
              </Button>
          </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} className="group transition-all hover:shadow-md">
                <InvoiceCard.Header />
                <InvoiceCard.Client />
                <InvoiceCard.Amount />
                <InvoiceCard.Actions>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)}>
                        <Download className="h-4 w-4 mr-2" /> PDF
                    </Button>
                    <Button size="sm" asChild>
                        <Link href={`/invoices/${invoice.id}`}>View</Link>
                    </Button>
                </InvoiceCard.Actions>
            </InvoiceCard>
            ))}
        </div>
      )}
    </div>
  );
}
