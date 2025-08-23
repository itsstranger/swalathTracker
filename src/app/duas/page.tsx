// src/app/duas/page.tsx
'use client';

import { Header } from '@/components/header';
import { DuaTracker } from '@/components/trackers/dua-tracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDuaTracker } from '@/hooks/use-dua-store';
import { Skeleton } from '@/components/ui/skeleton';

export default function DuasPage() {
    const { duaData, updateDuaData, isInitialized } = useDuaTracker();
    
    return (
        <main className="min-h-screen bg-background text-foreground font-body">
            <div className="container mx-auto p-4 md:p-6">
                <Header />
                <div className="mt-6 flex justify-center">
                    <div className="w-full md:w-3/4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daily Duas</CardTitle>
                                <CardDescription>Mark your daily Duas and supplications.</CardDescription>
                            </CardHeader>
                        </Card>
                        {isInitialized && duaData ? (
                            <DuaTracker duaData={duaData} onUpdate={updateDuaData} />
                        ) : (
                            <Skeleton className="h-32 w-full" />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
