// src/components/quran/quran-header.tsx
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings, Search } from 'lucide-react';
import type { Surah } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface QuranHeaderProps {
  surah: Surah | null;
  onToggleSidebar: () => void;
  juz: number | null;
  hizb: number | null;
  page: number | null;
}

export const QuranHeader: FC<QuranHeaderProps> = ({ surah, onToggleSidebar, juz, hizb, page }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#191919] sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu />
        </Button>
        <div>
          {surah ? (
            <h1 className="text-lg font-semibold">{surah.englishName}</h1>
          ) : (
            <Skeleton className="h-7 w-32 bg-gray-700" />
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        {surah && juz && hizb && page && (
          <p className="text-sm text-white/70">
            Juz {juz} / Hizb {hizb} - Page {page}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings />
        </Button>
      </div>
    </header>
  );
};
