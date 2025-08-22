// src/components/trackers/prayers-tracker.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const prayerItems = [
  { id: 'fajr', label: 'Fajr' },
  { id: 'dhuhr', label: 'Dhuhr' },
  { id: 'asr', label: 'Asr' },
  { id: 'maghrib', label: 'Maghrib' },
  { id: 'isha', label: 'Isha' },
  { id: 'rawathib', label: 'Rawathib' },
  { id: 'tahajjud', label: 'Tahajjud' },
  { id: 'dhuha', label: 'Dhuha' },
  { id: 'witr', label: 'Witr' },
];

export const PrayersTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Prayers</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {prayerItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox id={item.id} />
            <Label htmlFor={item.id} className="text-base">
              {item.label}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
