"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { InvoiceFormFullValues } from "@/lib/schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Step3Props {
  form: UseFormReturn<InvoiceFormFullValues>;
}

export function Step3LineItems({ form }: Step3Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "invoice.items",
  });

  const currency = form.watch("invoice.currency");

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Line Items</h2>
        <Button
          type="button"
          onClick={() => append({ description: "", quantity: 1, unitPrice: 0, vatRate: 0 })}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 p-4 border rounded-md items-end bg-card/50">
            <div className="col-span-5">
              <FormField
                control={form.control}
                name={`invoice.items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Item description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-2">
              <FormField
                control={form.control}
                name={`invoice.items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name={`invoice.items.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
             <div className="col-span-2">
              <FormField
                control={form.control}
                name={`invoice.items.${index}.vatRate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
       {fields.length === 0 && (
         <div className="text-center text-muted-foreground py-8">
           No items added. Please add at least one item.
         </div>
       )}
    </div>
  );
}
