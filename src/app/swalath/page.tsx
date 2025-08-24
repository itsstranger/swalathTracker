// src/app/swalath/page.tsx
'use client';

import { useEffect } from 'react';
import { useSwalathStore } from '@/hooks/use-swalath-store';
import { Header } from '@/components/header';
import { HistoryView } from '@/components/history-view';
import { HadithBanner } from '@/components/hadith-banner';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { GlassCard } from '@/components/glass-card';

export default function SwalathTrackerPage() {
  const entries = useSwalathStore((state) => state.entries);
  const { openFormForDate, openDatePicker, deleteEntry, initialize } = useSwalathStore((state) => state.actions);
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const unsubscribe = initialize(user, loading);
    return () => unsubscribe?.();
  }, [user, loading, initialize]);

  const handleDelete = (id: string) => {
    deleteEntry(id);
  };

  const handleOpenForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    openFormForDate(today);
  }
  
  return (
    <main className="min-h-screen font-body">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 flex justify-center">
            <div className="w-full md:w-3/4 space-y-6">
                <GlassCard>
                    <CardHeader>
                        <CardTitle>Swalath Counter</CardTitle>
                        <CardDescription className="text-white/70">A simple counter to track total Swalaths for the day.</CardDescription>
                    </CardHeader>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={handleOpenForToday} size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                        <Plus className="mr-2" />
                        Add/Edit Today's Entry
                    </Button>
                    <Button onClick={openDatePicker} size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                        <CalendarPlus className="mr-2" />
                        Entry for Custom Date
                    </Button>
                </div>

                <HadithBanner />
                <HistoryView entries={entries} onEdit={(entry) => openFormForDate(entry.id)} onDelete={handleDelete} />
            </div>
        </div>
      </div>
    </main>
  );
}
