"use client";

import { useInvoices } from "@/context/InvoiceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

export default function DashboardPage() {
  const { invoices } = useInvoices();

  const totalIncome = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const pendingInvoices = invoices.filter((inv) => inv.status === "sent" || inv.status === "draft").length;
  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length;

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="container mx-auto py-4 space-y-4 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidInvoices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueInvoices}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7 flex-1 min-h-0">
        <Card className="col-span-1 lg:col-span-4 overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex-1 min-h-0">
            <RevenueChart invoices={invoices} />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">No recent invoices.</TableCell>
                    </TableRow>
                ) : (
                    recentInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                        <TableCell>{inv.client.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(inv.total, inv.currency)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'overdue' ? 'destructive' : 'secondary'}>
                              {inv.status}
                          </Badge>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
