// src/components/trackers/quran-tracker.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BookMarked, BookOpenCheck } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookMarked />
            Daily Recitation
          </CardTitle>
          <CardDescription>
            Log the amount of Quran you read today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hizb-juz" className="text-base">
            Hizb or Juz Read
          </Label>
          <Input id="hizb-juz" placeholder="e.g., 1 Juz, 2 Hizb" className="mt-2" />
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
                <Checkbox id={item.id} />
                <Label htmlFor={item.id} className="text-base">
                  {item.label}
                </Label>
              </div>
            ))}
            {isFriday && (
              <div key="kahf" className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 bg-primary/10">
                <Checkbox id="kahf" />
                <Label htmlFor="kahf" className="text-base font-semibold text-primary">
                  Kahf (Friday)
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
