'use client';

import { useSwalathStore } from '@/hooks/use-swalath-store';
import { Header } from '@/components/header';
import { SwalathForm } from '@/components/swalath-form';
import { DailyInsight } from '@/components/daily-insight';
import { HistoryView } from '@/components/history-view';

export default function Home() {
  const { entries, addOrUpdateEntry } = useSwalathStore();

  const today = new Date().toISOString().split('T')[0];
  const todaysEntry = entries.find((e) => e.id === today) || null;

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <SwalathForm entry={todaysEntry} onSave={addOrUpdateEntry} />
            <DailyInsight entry={todaysEntry} />
          </div>
          <div className="lg:col-span-2">
            <HistoryView entries={entries} />
          </div>
        </div>
      </div>
    </main>
  );
}
