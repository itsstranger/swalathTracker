// src/components/trackers/quran-tracker.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BookMarked, BookOpenCheck } from 'lucide-react';
import { useQuranStore } from '@/hooks/use-quran-store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface QuranTrackerProps {
  isFriday: boolean;
}

const surahItems = [
  { id: 'yasin', label: 'Yasin' },
  { id: 'mulk', label: 'Mulk' },
  { id: 'waqia', label: 'Waqia' },
  { id: 'rahman', label: 'Rahman' },
];

export const QuranTracker = ({ isFriday }: QuranTrackerProps) => {
  const {
    quranData,
    updateQuranData,
    setDailyGoal,
    isInitialized,
  } = useQuranStore();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState(20);
  const { toast } = useToast();

  useEffect(() => {
    // Only check to open the modal after the store has been initialized.
    if (isInitialized && quranData && quranData.dailyGoalPages === 0) {
      setIsGoalModalOpen(true);
    }
  }, [isInitialized, quranData]);

  const handleGoalSubmit = () => {
    if (goalInput > 0) {
      setDailyGoal(goalInput);
      setIsGoalModalOpen(false);
      toast({
        title: 'Daily Goal Set!',
        description: `Your daily goal is now ${goalInput} pages.`,
      });
    }
  };

  const handlePagesReadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pages = e.target.valueAsNumber;
    if (!isNaN(pages) && quranData) {
      updateQuranData({ ...quranData, pagesRead: pages < 0 ? 0 : pages });
    }
  };

  const handleSurahChange = (surah: keyof typeof quranData.surahs, checked: boolean) => {
    if (quranData) {
      const newSurahs = { ...quranData.surahs, [surah]: checked };
      updateQuranData({ ...quranData, surahs: newSurahs });
    }
  };

  const progress = quranData && quranData.dailyGoalPages > 0
    ? Math.round((quranData.pagesRead / quranData.dailyGoalPages) * 100)
    : 0;

  if (!quranData) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked />
              Daily Recitation
            </CardTitle>
            <CardDescription>
              Log the number of pages you read today and track your progress towards your daily goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-baseline">
              <Label htmlFor="pages-read" className="text-base">
                Pages Read Today
              </Label>
              <span className="text-sm text-muted-foreground">
                Goal: {quranData.dailyGoalPages} pages
              </span>
            </div>
            <Input
              id="pages-read"
              type="number"
              min="0"
              placeholder="e.g., 20"
              className="mt-2"
              value={quranData.pagesRead || ''}
              onChange={handlePagesReadChange}
            />
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-right text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenCheck />
              Daily Surahs
            </CardTitle>
            <CardDescription>
              Mark the special Surahs you recited today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {surahItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                  <Checkbox
                    id={item.id}
                    checked={quranData.surahs[item.id as keyof typeof quranData.surahs]}
                    onCheckedChange={(checked) => handleSurahChange(item.id as keyof typeof quranData.surahs, !!checked)}
                  />
                  <Label htmlFor={item.id} className="text-base">
                    {item.label}
                  </Label>
                </div>
              ))}
              {isFriday && (
                <div key="kahf" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 bg-primary/10">
                  <Checkbox
                    id="kahf"
                    checked={quranData.surahs.kahf}
                    onCheckedChange={(checked) => handleSurahChange('kahf', !!checked)}
                  />
                  <Label htmlFor="kahf" className="text-base font-semibold text-primary">
                    Kahf (Friday)
                  </Label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Your Daily Quran Goal</DialogTitle>
            <DialogDescription>
              To help you stay consistent, please set a daily goal for how many pages of the Quran you plan to read.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="goal-input">Daily Pages</Label>
            <Input
              id="goal-input"
              type="number"
              min="1"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.valueAsNumber)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleGoalSubmit}>Set Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
