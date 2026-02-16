import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoices/InvoicePDF";
import { InvoiceWithClient } from "@/types";

export const runtime = 'nodejs'; // Ensure this runs in a Node.js environment (required for @react-pdf/renderer)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const invoice = body.invoice as InvoiceWithClient;

    if (!invoice) {
        return NextResponse.json({ error: "Invoice data required" }, { status: 400 });
    }

    const stream = await renderToStream(<InvoicePDF invoice={invoice} />);
    
    // Convert stream to buffer or return Node stream if supported
    // Next.js App Router supports returning streams directly
    
    // We need to cast because types definition might be slightly off for Next.js Response body
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
