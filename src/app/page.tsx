'use client';

import { Header } from '@/components/header';
import { PrayersTracker } from '@/components/trackers/prayers-tracker';
import { QuranTracker } from '@/components/trackers/quran-tracker';
import { DuaTracker } from '@/components/trackers/dua-tracker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function Home() {
  const isFriday = new Date().getDay() === 5;

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 space-y-6">
          <PrayersTracker />
          <QuranTracker isFriday={isFriday} />
          <DuaTracker />

          <Card>
            <CardHeader>
              <CardTitle>Daily Reflections</CardTitle>
              <CardDescription>Add any notes or reflections for the day.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Write your thoughts here..." />
            </CardContent>
          </Card>
          
          <Button className="w-full" size="lg">
            <Save className="mr-2" />
            Save Today's Entry
          </Button>
        </div>
      </div>
    </main>
  );
}
