// src/components/todays-progress.tsx
'use client';

import type { FC } from 'react';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import type { PrayerTracking, QuranTracking, DuaTracking } from '@/lib/types';

interface TodaysProgressProps {
  prayerData: PrayerTracking | null;
  quranData: QuranTracking | null;
  duaData: DuaTracking | null;
}

export const TodaysProgress: FC<TodaysProgressProps> = ({ prayerData, quranData, duaData }) => {
  const { progress, completedTasks, totalTasks } = useMemo(() => {
    let completed = 0;
    let total = 0;

    // Prayers
    if (prayerData) {
      const obligatory = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
      total += obligatory.length;
      completed += obligatory.filter(p => prayerData[p].status === 'prayed').length;
    } else {
      total += 5;
    }

    // Quran
    if (quranData && quranData.dailyGoalPages > 0) {
      total += 1;
      if (quranData.pagesRead >= quranData.dailyGoalPages) {
        completed += 1;
      }
    } else {
        total += 1;
    }
    
    // Duas
    if (duaData) {
      const duas = ['dhuha', 'afterMaghrib'] as const;
      total += duas.length;
      completed += duas.filter(d => duaData[d]).length;
    } else {
      total += 2;
    }

    const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { progress: overallProgress, completedTasks: completed, totalTasks: total };
  }, [prayerData, quranData, duaData]);

  const getGreeting = () => {
    if (progress === 100) return "Masha'Allah! All goals completed!";
    if (progress > 70) return "You're doing great, keep it up!";
    if (progress > 30) return "Good start, let's keep going!";
    return "Let's start ticking off your daily goals.";
  }

  return (
    <Card className="bg-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <CheckCircle2 className="text-primary" />
            Today's Progress
        </CardTitle>
        <CardDescription>{getGreeting()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={progress} />
        <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
            <p className="font-bold text-primary">{progress}%</p>
        </div>
      </CardContent>
    </Card>
  );
};
