'use client';

import { useState } from 'react';
import { useSwalathStore } from '@/hooks/use-swalath-store';
import { Header } from '@/components/header';
import { SwalathForm } from '@/components/swalath-form';
import { DailyInsight } from '@/components/daily-insight';
import { HistoryView } from '@/components/history-view';
import type { SwalathEntry } from '@/lib/types';
import { HadithBanner } from '@/components/hadith-banner';

export default function Home() {
  const { entries, addOrUpdateEntry, deleteEntry, setSelectedEntryId, getSelectedEntry } = useSwalathStore();

  const selectedEntry = getSelectedEntry();
  
  const handleEdit = (entry: SwalathEntry) => {
    setSelectedEntryId(entry.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = (id: string) => {
    deleteEntry(id);
  };
  
  const handleSave = (entry: SwalathEntry) => {
    addOrUpdateEntry(entry);
    if(selectedEntry?.id === entry.id) {
      setSelectedEntryId(null);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <div className="mt-8">
          <HadithBanner />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <SwalathForm entry={selectedEntry} onSave={handleSave} onCancel={() => setSelectedEntryId(null)} />
            <DailyInsight entry={selectedEntry} />
          </div>
          <div className="lg:col-span-2">
            <HistoryView entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </main>
  );
}
