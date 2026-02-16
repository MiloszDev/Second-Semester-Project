"use client";

import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceFormSchema, InvoiceFormFullValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import { Step1Client } from "./Step1Client";
import { Step2Details } from "./Step2Details";
import { Step3LineItems } from "./Step3LineItems";
import { Step4Review } from "./Step4Review";
import { useInvoices } from "@/context/InvoiceContext";
import { useClients } from "@/context/ClientContext";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "sonner";
// import InvoicePDF from "./InvoicePDF"; // To be implemented

export function InvoiceWizard() {
  const [step, setStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState<string | null>("new");
  const { addClient, clients } = useClients();
  const { addInvoice } = useInvoices();
  const router = useRouter();

  const form = useForm<InvoiceFormFullValues>({
    resolver: zodResolver(InvoiceFormSchema),
    defaultValues: {
      client: {
        name: "",
        companyName: "",
        email: "",
        vatNumber: "",
        address: "",
      },
      invoice: {
        invoiceNumber: "", // Will generate on mount/render if needed but better to keep controlled
        issueDate: new Date(),
        dueDate: new Date(),
        currency: "USD",
        items: [{ description: "Service", quantity: 1, unitPrice: 0, vatRate: 0 }],
      },
    },
    mode: "onChange",
  });

  // Generate invoice number on mount
  useState(() => {
      form.setValue("invoice.invoiceNumber", `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger("client");
    } else if (step === 2) {
      isValid = await form.trigger("invoice.issueDate");
      isValid = isValid && await form.trigger("invoice.dueDate");
      isValid = isValid && await form.trigger("invoice.invoiceNumber");
      isValid = isValid && await form.trigger("invoice.currency");
    } else if (step === 3) {
      isValid = await form.trigger("invoice.items");
    }

    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const onSubmit = async (data: InvoiceFormFullValues) => {
    try {
        let finalClientId = selectedClientId;

        if (!finalClientId || finalClientId === "new") {
            // Create new client from form data
            finalClientId = addClient(data.client);
        }

        // Add invoice
        if (finalClientId) {
            addInvoice({
                ...data.invoice,
                issueDate: data.invoice.issueDate.toISOString(),
                dueDate: data.invoice.dueDate.toISOString(),
                items: data.invoice.items.map(item => ({ ...item, id: uuidv4() })),
            }, finalClientId);
        }

        // Optional: Call API to generate PDF (we can do this later or redirect)
        
        toast.success("Invoice created successfully!");
        router.push("/dashboard");
    } catch (error) {
        console.error("Failed to create invoice:", error);
        toast.error("Failed to create invoice. Please try again.");
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create New Invoice</h1>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">Step {step} of 4</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <Step1Client 
                form={form} 
                clients={clients} 
                onClientSelect={(id: string) => {
                    setSelectedClientId(id);
                    if (id !== "new") {
                        const client = clients.find((c: any) => c.id === id); // c is Client type inferred usually but explicit any to fix error if inference fails
                        if (client) {
                            form.setValue("client", {
                                name: client.name,
                                companyName: client.companyName,
                                email: client.email,
                                vatNumber: client.vatNumber,
                                address: client.address,
                            });
                        }
                    } else {
                        form.setValue("client", {
                            name: "",
                            companyName: "",
                            email: "",
                            vatNumber: "",
                            address: "",
                        });
                    }
                }} 
            />
          )}
          {step === 2 && <Step2Details form={form} />}
          {step === 3 && <Step3LineItems form={form} />}
          {step === 4 && <Step4Review form={form} />}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            
            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Confirm & Create
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
