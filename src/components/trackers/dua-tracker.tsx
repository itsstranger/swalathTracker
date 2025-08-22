// src/components/trackers/dua-tracker.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const duaItems = [
  { id: 'dhuha', label: 'Dua after Dhuha' },
  { id: 'afterMaghrib', label: 'Dua after Maghrib' },
];

export const DuaTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Duas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duaItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox id={`dua-${item.id}`} />
            <Label htmlFor={`dua-${item.id}`} className="text-base">
              {item.label}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
