'use client';

import { useState } from 'react';
import { useSwalathStore } from '@/hooks/use-swalath-store';
import { Header } from '@/components/header';
import { HistoryView } from '@/components/history-view';
import type { SwalathEntry } from '@/lib/types';

export default function Home() {
  const { entries, deleteEntry, setSelectedEntryId } = useSwalathStore();
  
  const handleDelete = (id: string) => {
    deleteEntry(id);
  };
  
  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6">
            <HistoryView entries={entries} onEdit={(entry) => setSelectedEntryId(entry.id)} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}
