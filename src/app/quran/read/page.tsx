// src/app/quran/read/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { QuranHeader } from '@/components/quran/quran-header';
import { QuranReader } from '@/components/quran-reader';
import { QuranSidebar } from '@/components/quran/quran-sidebar';
import type { Surah } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReadQuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
          setSelectedSurah(data.data[0]); // Select Al-Fatihah by default
        }
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
  };

  return (
    <main className="min-h-screen font-body flex bg-[#111111] text-white">
      <QuranSidebar
        surahs={surahs}
        selectedSurah={selectedSurah}
        onSurahSelect={handleSurahSelect}
        isOpen={isSidebarOpen}
        isLoading={isLoading}
      />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <QuranHeader
          surah={selectedSurah}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLoading || !selectedSurah ? (
            <div className="space-y-6">
              <Skeleton className="h-16 w-full bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700" />
            </div>
          ) : (
            <QuranReader surah={selectedSurah} showTranslation={true} />
          )}
        </div>
      </div>
    </main>
  );
}
