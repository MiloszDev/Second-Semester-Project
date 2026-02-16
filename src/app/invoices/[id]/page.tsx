"use client";

import { useInvoices } from "@/context/InvoiceContext";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InvoicePDF } from "@/components/invoices/InvoicePDF";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-muted/10">Loading PDF Viewer...</div>,
});

export default function InvoiceDetailsPage() {
  const params = useParams();
  const { getInvoice } = useInvoices();
  const router = useRouter();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const invoice = id ? getInvoice(id) : undefined;

  if (!invoice) {
      return (
          <div className="container py-10 text-center">
              <h2 className="text-2xl font-bold">Invoice Not Found</h2>
              <Button onClick={() => router.push("/invoices")} className="mt-4">Back to Invoices</Button>
          </div>
      )
  }

  return (
    <div className="container mx-auto py-10 h-[calc(100vh-100px)] flex flex-col gap-4">
       <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
       </div>
       <div className="flex-1 border rounded-lg overflow-hidden bg-white shadow-sm">
           <PDFViewer width="100%" height="100%" showToolbar={true}>
              <InvoicePDF invoice={invoice} />
           </PDFViewer>
       </div>
    </div>
  );
}
