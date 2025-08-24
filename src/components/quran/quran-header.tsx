// src/components/quran/quran-header.tsx
'use client';

import type { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings, Search, ChevronDown } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import type { Surah } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface QuranHeaderProps {
  surahs: Surah[];
  selectedSurah: Surah | null;
  onSurahSelect: (surah: Surah) => void;
  onToggleSidebar: () => void;
  juz: number | null;
  hizb: number | null;
  page: number | null;
  showTranslation: boolean;
  onToggleTranslation: () => void;
}

export const QuranHeader: FC<QuranHeaderProps> = ({ 
  surahs,
  selectedSurah,
  onSurahSelect,
  onToggleSidebar, 
  juz, 
  hizb, 
  page, 
  showTranslation, 
  onToggleTranslation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (surah: Surah) => {
    onSurahSelect(surah);
    setIsPopoverOpen(false);
  }

  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#191919] sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu />
        </Button>
        <div>
          {selectedSurah ? (
             <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="text-lg font-semibold">
                        {selectedSurah?.englishName}
                        <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-72 bg-[#191919] border-white/10 text-white" align="start">
                    <div className="p-2">
                       <Input
                            placeholder="Search Surah"
                            className="bg-black/20 border-white/10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-72">
                        <div className="p-2 space-y-1">
                            {filteredSurahs.map((surah) => (
                                <Button
                                    key={surah.number}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start',
                                        selectedSurah?.number === surah.number && 'bg-primary/20 text-primary'
                                    )}
                                    onClick={() => handleSelect(surah)}
                                >
                                    <span className="text-sm text-white/50 w-8">{surah.number}</span>
                                    <span>{surah.englishName}</span>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </PopoverContent>
            </Popover>
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
