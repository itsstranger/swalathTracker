// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cog, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuranTracker } from '@/hooks/use-quran-store';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { quranData, setDailyGoal, isInitialized } = useQuranTracker();
  const [goal, setGoal] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (quranData) {
      setGoal(quranData.dailyGoalPages);
    }
  }, [quranData]);

  const handleSave = async () => {
    await setDailyGoal(goal);
    toast({
      title: 'Goal Updated',
      description: `Your daily Quran reading goal is now ${goal} pages.`,
    });
  };

  return (
    <main className="min-h-screen font-body pb-20">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 flex justify-center">
            <GlassCard className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                        <Cog />
                        Settings
                    </CardTitle>
                    <CardDescription className="text-white/70">
                        Manage your application settings and preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BookOpen className="text-primary"/>
                            Quran Settings
                        </h3>
                        {isInitialized && quranData ? (
                            <div className="space-y-2">
                                <Label htmlFor="quran-goal">Daily Reading Goal (pages)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="quran-goal"
                                        type="number"
                                        min="0"
                                        value={goal}
                                        onChange={(e) => setGoal(parseInt(e.target.value, 10) || 0)}
                                        className="bg-white/10 border-white/20"
                                    />
                                    <Button onClick={handleSave} disabled={goal === quranData.dailyGoalPages}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-12 flex-grow" />
                                    <Skeleton className="h-12 w-20" />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </GlassCard>
        </div>
      </div>
    </main>
  );
}
