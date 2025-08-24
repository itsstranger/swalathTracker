// src/app/quran/page.tsx
'use client';

import { Header } from '@/components/header';
import { QuranTracker } from '@/components/trackers/quran-tracker';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuranTracker } from '@/hooks/use-quran-store';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/glass-card';

export default function QuranPage() {
    const { isInitialized } = useQuranTracker();
    const [isFriday, setIsFriday] = useState(false);

    useEffect(() => {
        setIsFriday(new Date().getDay() === 5);
    }, []);

    return (
        <main className="min-h-screen font-body">
            <div className="container mx-auto p-4 md:p-6">
                <Header />
                <div className="mt-6 flex justify-center">
                    <div className="w-full md:w-3/4 space-y-6">
                        <GlassCard>
                            <CardHeader>
                                <CardTitle>Quran Reading</CardTitle>
                                <CardDescription className="text-white/70">Log your daily recitation and track important Surahs.</CardDescription>
                            </CardHeader>
                        </GlassCard>
                        
                        {isInitialized ? (
                            <QuranTracker isFriday={isFriday} />
                        ) : (
                            <div className="space-y-6">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
