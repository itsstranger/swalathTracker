// src/components/quran/quran-header.tsx
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings, Search } from 'lucide-react';
import type { Surah } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

interface QuranHeaderProps {
  title: string | null;
  onToggleSidebar: () => void;
  juz: number | null;
  hizb: number | null;
  page: number | null;
  showTranslation: boolean;
  onToggleTranslation: () => void;
}

export const QuranHeader: FC<QuranHeaderProps> = ({ title, onToggleSidebar, juz, hizb, page, showTranslation, onToggleTranslation }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#191919] sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu />
        </Button>
        <div>
          {title ? (
            <h1 className="text-lg font-semibold">{title}</h1>
          ) : (
            <Skeleton className="h-7 w-32 bg-gray-700" />
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        {juz && hizb && page && (
          <p className="text-sm text-white/70">
            Juz {juz} / Hizb {hizb} - Page {page}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search />
        </Button>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-[#191919] border-white/10 text-white">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Settings</h4>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="translation-switch">Translation</Label>
                        <Switch id="translation-switch" checked={showTranslation} onCheckedChange={onToggleTranslation} />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
