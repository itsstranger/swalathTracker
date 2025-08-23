
// src/app/prayers/page.tsx
'use client';

import { Header } from '@/components/header';
import { PrayersTracker } from '@/components/trackers/prayers-tracker';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrayerTracker } from '@/hooks/use-prayer-store';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export default function PrayersPage() {
    const { prayerData, updatePrayerData, isInitialized } = usePrayerTracker();
    const [isFriday, setIsFriday] = useState(false);

    useEffect(() => {
        setIsFriday(new Date().getDay() === 5);
    }, []);
    
    return (
        <main className="min-h-screen bg-background text-foreground font-body">
            <div className="container mx-auto p-4 md:p-6">
                <Header />
                <div className="mt-6 flex justify-center">
                    <div className="w-full md:w-3/4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daily Prayers</CardTitle>
                                <CardDescription>Track your daily obligatory and voluntary prayers.</CardDescription>
                            </CardHeader>
                        </Card>
                        
                        {isInitialized && prayerData ? (
                            <PrayersTracker prayerData={prayerData} onUpdate={updatePrayerData} isFriday={isFriday} />
                        ) : (
                            <div className="space-y-6">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
