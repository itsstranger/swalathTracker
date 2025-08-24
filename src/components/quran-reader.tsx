// src/components/quran-reader.tsx
'use client';

import { FC, useEffect, useRef } from 'react';
import { CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import type { Ayah } from '@/lib/types';

interface QuranReaderProps {
  ayahs: Ayah[];
  translations: Ayah[];
  showTranslation: boolean;
  onFirstAyahLoad: (ayah: Ayah | null) => void;
  surahName?: string;
  isSingleSurahView: boolean;
}

const PageBreak = ({ pageNumber }: { pageNumber: number }) => (
    <div className="flex items-center gap-4 my-8">
        <Separator className="flex-1 bg-white/20" />
        <span className="text-sm text-white/70">Page {pageNumber}</span>
        <Separator className="flex-1 bg-white/20" />
    </div>
);

export const QuranReader: FC<QuranReaderProps> = ({
  ayahs,
  translations,
  showTranslation,
  onFirstAyahLoad,
  surahName,
  isSingleSurahView,
}) => {

  const hasLoadedFirstAyah = useRef(false);

  useEffect(() => {
    if (ayahs.length > 0 && !hasLoadedFirstAyah.current) {
      onFirstAyahLoad(ayahs[0]);
      hasLoadedFirstAyah.current = true;
    }
  }, [ayahs, onFirstAyahLoad]);
  
  useEffect(() => {
    // Reset when ayahs are cleared (new surah selected)
    if(ayahs.length === 0) {
      hasLoadedFirstAyah.current = false;
    }
  }, [ayahs]);

  const Bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

  return (
    <div className="bg-[#191919] rounded-lg">
      {isSingleSurahView && surahName && (
        <CardHeader className="text-center border-b border-white/10">
          <CardTitle className={cn("text-4xl font-amiri")}>{surahName}</CardTitle>
          <p className="text-2xl font-amiri pt-4">{Bismillah}</p>
        </CardHeader>
      )}
      <CardContent className="space-y-8 p-4 md:p-8">
        <div className="space-y-6">
          {showTranslation ? (
            ayahs.map((ayah, index) => {
              const prevAyah = index > 0 ? ayahs[index - 1] : null;
              const showPageBreak = prevAyah && ayah.page !== prevAyah.page;
              return (
                <div key={`${ayah.numberInSurah}-${ayah.surah?.number || 0}`}>
                  {showPageBreak && <PageBreak pageNumber={ayah.page} />}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary font-bold">{ayah.numberInSurah}</span>
                        <p className="text-2xl font-amiri text-right flex-1" dir="rtl">{ayah.text}</p>
                    </div>
                    <p className="text-white/80 pl-12">
                      {translations[index]?.text}
                    </p>
                  </div>
                  {index < ayahs.length - 1 && !showPageBreak && <Separator className="my-6 bg-white/20"/>}
                </div>
              );
            })
          ) : (
             <div className="text-3xl font-amiri text-right leading-loose text-justify" dir="rtl">
              {ayahs.map((ayah, index) => {
                  const prevAyah = index > 0 ? ayahs[index - 1] : null;
                  const showPageBreak = prevAyah && ayah.page !== prevAyah.page;
                  return (
                      <span key={`${ayah.numberInSurah}-${ayah.surah?.number || 0}`}>
                          {showPageBreak && (
                              <span className="inline-block w-full text-center" dir="ltr">
                                  <PageBreak pageNumber={ayah.page} />
                              </span>
                          )}
                          {ayah.text}
                          <span className="inline-block mx-2 text-sm text-primary border border-primary rounded-full w-8 h-8 leading-8 text-center font-sans">
                              {ayah.numberInSurah.toLocaleString('ar-EG')}
                          </span>
                      </span>
                  );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};
