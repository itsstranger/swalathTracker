// src/app/swalath/page.tsx
'use client';

import { useSwalathStore } from '@/hooks/use-swalath-store';
import { Header } from '@/components/header';
import { HistoryView } from '@/components/history-view';
import { HadithBanner } from '@/components/hadith-banner';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SwalathTrackerPage() {
  const { entries, deleteEntry, setSelectedEntryId } = useSwalathStore();
  
  const handleDelete = (id: string) => {
    deleteEntry(id);
  };
  
  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Swalath Counter</CardTitle>
                    <CardDescription>A simple counter to track total Swalaths for the day.</CardDescription>
                </CardHeader>
            </Card>
            <HadithBanner />
            <HistoryView entries={entries} onEdit={(entry) => setSelectedEntryId(entry.id)} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}
