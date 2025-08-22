// src/app/quran/page.tsx
'use client';

import { Header } from '@/components/header';
import { QuranTracker } from '@/components/trackers/quran-tracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function QuranPage() {
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
                    <QuranTracker isFriday={isFriday} />
                    <Button className="w-full" size="lg">
                        <Save className="mr-2" />
                        Save Quran Reading
                    </Button>
                </div>
            </div>
        </main>
    );
}
