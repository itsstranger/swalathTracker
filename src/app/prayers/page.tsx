// src/app/prayers/page.tsx
import { Header } from '@/components/header';
import { PrayersTracker } from '@/components/trackers/prayers-tracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function PrayersPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-body">
            <div className="container mx-auto p-4 md:p-6">
                <Header />
                <div className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Prayers</CardTitle>
                            <CardDescription>Track your daily obligatory and voluntary prayers.</CardDescription>
                        </CardHeader>
                    </Card>
                    <PrayersTracker />
                    <Button className="w-full" size="lg">
                        <Save className="mr-2" />
                        Save Prayers
                    </Button>
                </div>
            </div>
        </main>
    );
}
