// src/app/quran/page.tsx
'use client';

import { Header } from '@/components/header';
import { QuranTracker } from '@/components/trackers/quran-tracker';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuranStore } from '@/hooks/use-quran-store';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuranPage() {
    const { isInitialized } = useQuranStore();
    const isFriday = new Date().getDay() === 5;

    return (
        <main className="min-h-screen bg-background text-foreground font-body">
            <div className="container mx-auto p-4 md:p-6">
                <Header />
                <div className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quran Reading</CardTitle>
                            <CardDescription>Log your daily recitation and track important Surahs.</CardDescription>
                        </CardHeader>
                    </Card>
                    
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
        </main>
    );
}
