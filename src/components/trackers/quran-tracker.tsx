// src/components/trackers/quran-tracker.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
    <Card>
      <CardHeader>
        <CardTitle>Quran Reading</CardTitle>
        <CardDescription>Track your daily recitation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {surahItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox id={item.id} />
              <Label htmlFor={item.id} className="text-base">
                {item.label}
              </Label>
            </div>
          ))}
          {isFriday && (
             <div key="kahf" className="flex items-center space-x-2">
              <Checkbox id="kahf" />
              <Label htmlFor="kahf" className="text-base font-semibold text-primary">
                Kahf (Friday)
              </Label>
            </div>
          )}
        </div>
        <div>
            <Label htmlFor="hizb-juz">Hizb/Juz Read</Label>
            <Input id="hizb-juz" placeholder="e.g., 1 Juz" />
        </div>
      </CardContent>
    </Card>
  );
};
