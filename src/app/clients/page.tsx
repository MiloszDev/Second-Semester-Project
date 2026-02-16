"use client";

import { ClientList } from "@/components/clients/ClientList";
import { ClientDialog } from "@/components/clients/ClientDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useClients } from "@/context/ClientContext";

export default function ClientsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { addClient } = useClients();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Client
        </Button>
      </div>
      
      <ClientList />

      <ClientDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={(data) => {
          addClient(data);
        }}
      />
    </div>
  );
}
