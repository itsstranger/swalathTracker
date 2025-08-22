// src/app/duas/page.tsx
import { Header } from '@/components/header';
import { DuaTracker } from '@/components/trackers/dua-tracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function DuasPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-body">
            <div className="container mx-auto p-4 md:p-6">
                <Header />
                <div className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Duas</CardTitle>
                            <CardDescription>Mark your daily Duas and supplications.</CardDescription>
                        </CardHeader>
                    </Card>
                    <DuaTracker />
                    <Button className="w-full" size="lg">
                        <Save className="mr-2" />
                        Save Duas
                    </Button>
                </div>
            </div>
        </main>
    );
}
