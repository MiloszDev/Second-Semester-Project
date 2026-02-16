"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client, ClientFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ClientContextType {
  clients: Client[];
  addClient: (data: ClientFormData) => string;
  updateClient: (id: string, data: ClientFormData) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      try {
        setClients(JSON.parse(storedClients));
      } catch (e) {
        console.error('Failed to parse clients from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (data: ClientFormData) => {
    const id = uuidv4();
    const newClient: Client = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [...prev, newClient]);
    return id;
  };

  const updateClient = (id: string, data: ClientFormData) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, ...data } : client))
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  const getClient = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{ clients, addClient, updateClient, deleteClient, getClient }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}
