// src/components/quran/quran-sidebar.tsx
'use client';

import { FC, useState } from 'react';
import { ChevronDown, ChevronsLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { Surah } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface QuranSidebarProps {
  surahs: Surah[];
  selectedSurah: Surah | null;
  onSurahSelect: (surah: Surah) => void;
  isOpen: boolean;
  isLoading: boolean;
}

export const QuranSidebar: FC<QuranSidebarProps> = ({
  surahs,
  selectedSurah,
  onSurahSelect,
  isOpen,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-80 bg-[#191919] border-r border-white/10 flex flex-col h-screen">
      <div className="p-4 border-b border-white/10">
        <Button variant="ghost" className="w-full justify-between">
          <span>{selectedSurah?.englishName || 'Select Surah'}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4">
        {/* Placeholder for Tabs */}
        <div className="text-sm text-center text-white/70 p-2 border-b-2 border-primary">Surah</div>
      </div>
      <div className="p-4">
        <Input
          placeholder="Search Surah"
          className="bg-black/20 border-white/10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-gray-700" />
            ))
          ) : (
            filteredSurahs.map((surah) => (
              <Button
                key={surah.number}
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  selectedSurah?.number === surah.number && 'bg-primary/20 text-primary'
                )}
                onClick={() => onSurahSelect(surah)}
              >
                <span className="text-sm text-white/50 w-8">{surah.number}</span>
                <span>{surah.englishName}</span>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};
