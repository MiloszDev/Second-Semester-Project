"use client";

import { InvoiceWithClient } from "@/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";

interface RevenueChartProps {
  invoices: InvoiceWithClient[];
}

export function RevenueChart({ invoices }: RevenueChartProps) {
  const data = useMemo(() => {
    // Group invoices by month
    const grouped = invoices.reduce((acc, invoice) => {
      // Use createdAt or issueDate
      const date = parseISO(invoice.issueDate);
      const month = format(date, "MMM yyyy");
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      
      acc[month] += invoice.total;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array
    return Object.entries(grouped).map(([name, total]) => ({
      name,
      total,
    })).sort((a, b) => {
        // Simple sort by date if needed, or rely on insert order?
        // Better to sort by actual date
        return new Date(a.name).getTime() - new Date(b.name).getTime();
    });
  }, [invoices]);

  if (data.length === 0) {
      return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
            dataKey="name" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
        />
        <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  );
}
