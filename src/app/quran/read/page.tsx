// src/app/quran/read/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { GlassCard } from '@/components/glass-card';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { QuranReader } from '@/components/quran-reader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

type ViewMode = 'with-translation' | 'reading-only';

export default function ReadQuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('with-translation');

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const handleSurahChange = (value: string) => {
    setSelectedSurah(Number(value));
  };

  const selectedSurahInfo = surahs.find(s => s.number === selectedSurah);

  return (
    <main className="min-h-screen font-body">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 flex justify-center">
          <div className="w-full md:w-3/4 space-y-6">
            <GlassCard>
              <CardHeader>
                <CardTitle>Read the Holy Quran</CardTitle>
                <CardDescription className="text-white/70">Select a Surah and reading mode to begin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select onValueChange={handleSurahChange} defaultValue={String(selectedSurah)}>
                    <SelectTrigger className="w-full bg-white/10 border-white/20">
                      <SelectValue placeholder="Select a Surah" />
                    </SelectTrigger>
                    <SelectContent>
                      {surahs.map((surah) => (
                        <SelectItem key={surah.number} value={String(surah.number)}>
                          {surah.number}. {surah.englishName} ({surah.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <RadioGroup
                    value={viewMode}
                    onValueChange={(value: ViewMode) => setViewMode(value)}
                    className="flex items-center space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-translation" id="with-translation" />
                        <Label htmlFor="with-translation">With Translation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reading-only" id="reading-only" />
                        <Label htmlFor="reading-only">Reading Only</Label>
                    </div>
                </RadioGroup>
              </CardContent>
            </GlassCard>

            {selectedSurahInfo && (
                <QuranReader surah={selectedSurahInfo} showTranslation={viewMode === 'with-translation'} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
