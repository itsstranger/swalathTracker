// src/app/quran/read/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuranHeader } from '@/components/quran/quran-header';
import { QuranReader } from '@/components/quran-reader';
import { QuranSidebar } from '@/components/quran/quran-sidebar';
import type { Surah, Ayah } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReadQuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [translations, setTranslations] = useState<Ayah[]>([]);
  const [readerTitle, setReaderTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReaderLoading, setIsReaderLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
          handleSurahSelect(data.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const fetchAndSetAyahs = useCallback(async (url: string, title: string) => {
    try {
      setIsReaderLoading(true);
      setReaderTitle(title);
      setCurrentAyah(null);

      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200) {
        const arabicAyahs: Ayah[] = data.data[0].ayahs;
        setAyahs(arabicAyahs);
        setTranslations(data.data[1].ayahs);
        if (arabicAyahs.length > 0) {
          setCurrentAyah(arabicAyahs[0]);
        }
      } else {
        setAyahs([]);
        setTranslations([]);
      }
    } catch (error) {
      console.error('Failed to fetch ayahs:', error);
      setAyahs([]);
      setTranslations([]);
    } finally {
      setIsReaderLoading(false);
    }
  }, []);

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    const title = `${surah.englishName} (${surah.englishNameTranslation})`;
    const url = `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih`;
    fetchAndSetAyahs(url, title);
  };
  
  const handleJuzSelect = (juz: number) => {
    setSelectedSurah(null);
    const title = `Juz ${juz}`;
    const url = `https://api.alquran.cloud/v1/juz/${juz}/editions/quran-uthmani,en.sahih`;
    fetchAndSetAyahs(url, title);
  }

  const handlePageSelect = (page: number) => {
    setSelectedSurah(null);
    const title = `Page ${page}`;
    const url = `https://api.alquran.cloud/v1/page/${page}/editions/quran-uthmani,en.sahih`;
    fetchAndSetAyahs(url, title);
  }

  return (
    <main className="min-h-screen font-body flex bg-[#111111] text-white">
      <QuranSidebar
        surahs={surahs}
        selectedSurah={selectedSurah}
        onSurahSelect={handleSurahSelect}
        onJuzSelect={handleJuzSelect}
        onPageSelect={handlePageSelect}
        isOpen={isSidebarOpen}
        isLoading={isLoading}
      />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <QuranHeader
          title={readerTitle}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          juz={currentAyah?.juz || null}
          hizb={currentAyah ? Math.floor(((currentAyah.hizbQuarter -1)/4) + 1) : null}
          page={currentAyah?.page || null}
          showTranslation={showTranslation}
          onToggleTranslation={() => setShowTranslation(!showTranslation)}
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isReaderLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-16 w-full bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700" />
            </div>
          ) : (
            <QuranReader 
              ayahs={ayahs}
              translations={translations}
              showTranslation={showTranslation}
              onFirstAyahLoad={setCurrentAyah}
              surahName={selectedSurah?.name}
              isSingleSurahView={!!selectedSurah}
            />
          )}
        </div>
      </div>
    </main>
  );
}
