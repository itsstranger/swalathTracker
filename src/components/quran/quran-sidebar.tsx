// src/components/quran/quran-sidebar.tsx
'use client';

import { FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { Surah } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QuranSidebarProps {
  surahs: Surah[];
  selectedSurah: Surah | null;
  onSurahSelect: (surah: Surah) => void;
  onJuzSelect: (juz: number) => void;
  onPageSelect: (page: number) => void;
  isOpen: boolean;
  isLoading: boolean;
}

export const QuranSidebar: FC<QuranSidebarProps> = ({
  surahs,
  selectedSurah,
  onSurahSelect,
  onJuzSelect,
  onPageSelect,
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
    <aside className="w-80 bg-[#191919] border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold">Quran</h2>
      </div>
      
      <Tabs defaultValue="surah" className="flex flex-col flex-1 min-h-0">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger value="surah">Surah</TabsTrigger>
            <TabsTrigger value="juz">Juz</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="surah" className="flex flex-col flex-1 min-h-0 mt-0">
          <div className="p-4">
            <Input
              placeholder="Search Surah"
              className="bg-black/20 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-2 pt-0">
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
        </TabsContent>
        
        <TabsContent value="juz" className="mt-0 flex-1 overflow-y-auto">
            <div className="p-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <Button key={juz} variant="outline" className="bg-transparent border-white/20" onClick={() => onJuzSelect(juz)}>
                  Juz {juz}
                </Button>
              ))}
            </div>
        </TabsContent>

        <TabsContent value="page" className="mt-0 flex-1 overflow-y-auto">
              <div className="p-4 grid grid-cols-4 gap-2">
                {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
                  <Button key={page} variant="outline" size="sm" className="bg-transparent border-white/20" onClick={() => onPageSelect(page)}>
                    {page}
                  </Button>
                ))}
              </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};
