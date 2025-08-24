// src/components/quran-reader.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import { GlassCard } from './glass-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
}

interface QuranReaderProps {
  surah: Surah;
}

export const QuranReader: FC<QuranReaderProps> = ({ surah }) => {
  const [ayats, setAyats] = useState<{ arabic: Ayah[]; english: Ayah[] }>({ arabic: [], english: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSurahData() {
      if (!surah) return;
      try {
        setIsLoading(true);
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih`);
        const data = await response.json();
        if (data.code === 200) {
          setAyats({
            arabic: data.data[0].ayahs,
            english: data.data[1].ayahs,
          });
        }
      } catch (error) {
        console.error('Failed to fetch surah data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSurahData();
  }, [surah]);

  return (
    <GlassCard>
      <CardHeader className="text-center">
        <CardTitle className="font-arabic text-4xl">{surah.name}</CardTitle>
        <CardDescription className="text-white/80 text-xl font-headline">
          {surah.englishName} ({surah.englishNameTranslation})
        </CardDescription>
        <p className="text-sm text-white/60">{surah.revelationType} - {surah.numberOfAyahs} Ayahs</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          ayats.arabic.map((ayah, index) => (
            <div key={ayah.number}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary font-bold">{ayah.numberInSurah}</span>
                    <p className="text-2xl font-arabic text-right flex-1" dir="rtl">{ayah.text}</p>
                </div>
                <p className="text-white/80 pl-12">
                  {ayats.english[index]?.text}
                </p>
              </div>
              {index < ayats.arabic.length - 1 && <Separator className="my-6 bg-white/20"/>}
            </div>
          ))
        )}
      </CardContent>
    </GlassCard>
  );
};
