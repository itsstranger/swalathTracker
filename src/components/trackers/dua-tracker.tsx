// src/components/trackers/dua-tracker.tsx
'use client';

import type { FC } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { DuaTracking } from '@/lib/types';
import { GlassCard } from '../glass-card';

interface DuaTrackerProps {
  duaData: DuaTracking;
  onUpdate: (data: DuaTracking) => void;
}

const duaItems: { id: keyof DuaTracking; label: string }[] = [
  { id: 'dhuha', label: 'Dua after Dhuha' },
  { id: 'afterMaghrib', label: 'Dua after Maghrib' },
];

export const DuaTracker: FC<DuaTrackerProps> = ({ duaData, onUpdate }) => {
  const handleDuaChange = (dua: keyof DuaTracking, checked: boolean) => {
    onUpdate({
      ...duaData,
      [dua]: checked,
    });
  };

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle>Daily Duas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duaItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={`dua-${item.id}`}
              checked={duaData[item.id]}
              onCheckedChange={(checked) => handleDuaChange(item.id, !!checked)}
            />
            <Label htmlFor={`dua-${item.id}`} className="text-base">
              {item.label}
            </Label>
          </div>
        ))}
      </CardContent>
    </GlassCard>
  );
};
