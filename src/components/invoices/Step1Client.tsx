"use client";

import { UseFormReturn } from "react-hook-form";
import { InvoiceFormFullValues } from "@/lib/schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types";

interface Step1Props {
  form: UseFormReturn<InvoiceFormFullValues>;
  clients: Client[];
  onClientSelect: (id: string) => void;
}

export function Step1Client({ form, clients, onClientSelect }: Step1Props) {
  const handleClientSelect = (clientId: string) => {
    onClientSelect(clientId);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Client Details</h2>
        <Select onValueChange={handleClientSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select existing client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New Client</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="client.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Client Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client.companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client.vatNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT Number</FormLabel>
              <FormControl>
                <Input placeholder="VAT Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client.address"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
