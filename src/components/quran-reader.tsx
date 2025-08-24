// src/components/quran-reader.tsx
'use client';

import { useState, useEffect, FC } from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import type { Surah, Ayah } from '@/lib/types';

interface QuranReaderProps {
  surah: Surah;
  showTranslation: boolean;
  onFirstAyahLoad: (ayah: Ayah) => void;
}

export const QuranReader: FC<QuranReaderProps> = ({ surah, showTranslation, onFirstAyahLoad }) => {
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
          const arabicAyahs: Ayah[] = data.data[0].ayahs;
          setAyats({
            arabic: arabicAyahs,
            english: data.data[1].ayahs,
          });
          if (arabicAyahs.length > 0) {
            onFirstAyahLoad(arabicAyahs[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch surah data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSurahData();
  }, [surah, onFirstAyahLoad]);

  return (
    <div className="bg-[#191919] rounded-lg">
      <CardHeader className="text-center border-b border-white/10">
        <CardTitle className={cn("text-4xl font-amiri")}>{surah.name}</CardTitle>
        <CardDescription className="text-white/80 text-xl font-headline">
          {surah.englishName} ({surah.englishNameTranslation})
        </CardDescription>
        <p className="text-sm text-white/60">{surah.revelationType} - {surah.numberOfAyahs} Ayahs</p>
      </CardHeader>
      <CardContent className="space-y-8 p-4 md:p-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full bg-gray-700" />
            <Skeleton className="h-16 w-full bg-gray-700" />
            <Skeleton className="h-16 w-full bg-gray-700" />
          </div>
        ) : (
          <div className="space-y-6">
            {showTranslation ? (
              ayats.arabic.map((ayah, index) => (
                <div key={ayah.number}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary font-bold">{ayah.numberInSurah}</span>
                        <p className="text-2xl font-amiri text-right flex-1" dir="rtl">{ayah.text}</p>
                    </div>
                    <p className="text-white/80 pl-12">
                      {ayats.english[index]?.text}
                    </p>
                  </div>
                  {index < ayats.arabic.length - 1 && <Separator className="my-6 bg-white/20"/>}
                </div>
              ))
            ) : (
              <p className="text-3xl font-amiri text-right leading-loose text-justify" dir="rtl">
                {ayats.arabic.map((ayah) => (
                  <span key={ayah.numberInSurah}>
                    {ayah.text}
                    <span className="inline-block mx-2 text-sm text-primary border border-primary rounded-full w-8 h-8 leading-8 text-center font-sans">
                        {ayah.numberInSurah.toLocaleString('ar-EG')}
                    </span>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
};
