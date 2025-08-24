// src/app/page.tsx
'use client';

import { Header } from '@/components/header';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DailyInsight } from '@/components/daily-insight';
import { useSwalathStore } from '@/hooks/use-swalath-store';
import { usePrayerTracker } from '@/hooks/use-prayer-store';
import { useQuranTracker } from '@/hooks/use-quran-store';
import { useDuaTracker } from '@/hooks/use-dua-store';
import { TodaysProgress } from '@/components/todays-progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Moon, ShieldCheck, Bot } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { GlassCard } from '@/components/glass-card';

export default function Home() {
  const { entries } = useSwalathStore();
  const { prayerData, isInitialized: prayersInitialized } = usePrayerTracker();
  const { quranData, isInitialized: quranInitialized } = useQuranTracker();
  const { duaData, isInitialized: duasInitialized } = useDuaTracker();
  
  const today = new Date().toISOString().split('T')[0];
  const todaysSwalathEntry = entries.find(e => e.id === today) || null;

  const isDataReady = prayersInitialized && quranInitialized && duasInitialized;

  const { completedPrayers, totalPrayers } = useMemo(() => {
    if (!prayerData) return { completedPrayers: 0, totalPrayers: 5 };
    const obligatory = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
    const completed = obligatory.filter(p => prayerData[p].status === 'prayed').length;
    return { completedPrayers: completed, totalPrayers: 5 };
  }, [prayerData]);

  const { completedDuas, totalDuas } = useMemo(() => {
    if (!duaData) return { completedDuas: 0, totalDuas: 2 };
    const duas = ['dhuha', 'afterMaghrib'] as const;
    const completed = duas.filter(d => duaData[d]).length;
    return { completedDuas: completed, totalDuas: 2 };
  }, [duaData]);


  return (
    <main className="min-h-screen font-body pb-20">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 flex justify-center">
            <div className="w-full md:w-3/4 space-y-6">
              
              {isDataReady ? (
                <TodaysProgress 
                  prayerData={prayerData}
                  quranData={quranData}
                  duaData={duaData}
                />
              ) : (
                <Skeleton className="h-48 w-full" />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/prayers">
                    <GlassCard className="hover:bg-white/20 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ShieldCheck /> Prayers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {prayersInitialized ? (
                                <p className="text-2xl font-bold">{completedPrayers} <span className="text-base font-normal text-white/70">/ {totalPrayers} obligatory</span></p>
                            ) : <Skeleton className="h-8 w-24" />}
                        </CardContent>
                    </GlassCard>
                </Link>
                <Link href="/quran">
                    <GlassCard className="hover:bg-white/20 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen /> Quran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {quranInitialized && quranData ? (
                                <p className="text-2xl font-bold">{quranData.pagesRead} <span className="text-base font-normal text-white/70">/ {quranData.dailyGoalPages} pages</span></p>
                            ) : <Skeleton className="h-8 w-24" />}
                        </CardContent>
                    </GlassCard>
                </Link>
                <Link href="/duas">
                    <GlassCard className="hover:bg-white/20 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Moon /> Duas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {duasInitialized ? (
                                 <p className="text-2xl font-bold">{completedDuas} <span className="text-base font-normal text-white/70">/ {totalDuas} daily</span></p>
                            ) : <Skeleton className="h-8 w-24" />}
                        </CardContent>
                    </GlassCard>
                </Link>
                <Link href="/swalath">
                    <GlassCard className="hover:bg-white/20 transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bot /> Swalath</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{todaysSwalathEntry?.total ?? 0} <span className="text-base font-normal text-white/70">today</span></p>
                        </CardContent>
                    </GlassCard>
                </Link>
              </div>

              <DailyInsight entry={todaysSwalathEntry} />

            </div>
        </div>
      </div>
    </main>
  );
}
