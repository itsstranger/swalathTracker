// src/app/quran/read/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

  // For infinite scroll
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const versesPerPage = 30;

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
          // Load the first surah by default
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

  const fetchSurahVerses = useCallback(async (surahNumber: number, page: number) => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);

    const offset = (page - 1) * versesPerPage;
    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih?limit=${versesPerPage}&offset=${offset}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.code === 200) {
        const newAyahs: Ayah[] = data.data[0].ayahs;
        const newTranslations: Ayah[] = data.data[1].ayahs;

        setAyahs(prev => (page === 1 ? newAyahs : [...prev, ...newAyahs]));
        setTranslations(prev => (page === 1 ? newTranslations : [...prev, ...newTranslations]));

        if (newAyahs.length < versesPerPage) {
          setHasMore(false);
        } else {
          setCurrentPage(page + 1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch ayahs:', error);
    } finally {
      setIsFetchingMore(false);
      if (page === 1) setIsReaderLoading(false);
    }
  }, [isFetchingMore]);

  const fetchFullContent = useCallback(async (url: string, title: string) => {
    try {
      setHasMore(false); // Disable infinite scroll for Juz/Page
      setIsReaderLoading(true);
      setReaderTitle(title);
      setCurrentAyah(null);
      setAyahs([]);
      setTranslations([]);

      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200) {
        const arabicAyahs: Ayah[] = data.data[0].ayahs;
        setAyahs(arabicAyahs);
        setTranslations(data.data[1].ayahs);
        if (arabicAyahs.length > 0) {
          setCurrentAyah(arabicAyahs[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsReaderLoading(false);
    }
  }, []);
  
  const lastVerseElementRef = useCallback((node: HTMLDivElement) => {
    if (isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && selectedSurah) {
          fetchSurahVerses(selectedSurah.number, currentPage);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isFetchingMore, hasMore, selectedSurah, currentPage, fetchSurahVerses]);


  const resetAndFetchSurah = (surah: Surah) => {
    setAyahs([]);
    setTranslations([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsReaderLoading(true);
    setReaderTitle(surah.englishName);
    fetchSurahVerses(surah.number, 1);
  };

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    resetAndFetchSurah(surah);
  };
  
  const handleJuzSelect = (juz: number) => {
    setSelectedSurah(null);
    const url = `https://api.alquran.cloud/v1/juz/${juz}/editions/quran-uthmani,en.sahih`;
    fetchFullContent(url, `Juz ${juz}`);
  }

  const handlePageSelect = (page: number) => {
    setSelectedSurah(null);
    const url = `https://api.alquran.cloud/v1/page/${page}/editions/quran-uthmani,en.sahih`;
    fetchFullContent(url, `Page ${page}`);
  }

  return (
    <main className="font-body bg-[#111111] text-white">
      <div className="flex h-screen w-full">
        <QuranSidebar
          surahs={surahs}
          selectedSurah={selectedSurah}
          onSurahSelect={handleSurahSelect}
          onJuzSelect={handleJuzSelect}
          onPageSelect={handlePageSelect}
          isOpen={isSidebarOpen}
          isLoading={isLoading}
        />
        <div className="flex-1 flex flex-col transition-all duration-300 min-h-0">
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
            <div className="mx-auto max-w-2xl">
              {isReaderLoading && ayahs.length === 0 ? (
                <div className="space-y-6">
                  <Skeleton className="h-16 w-full bg-gray-700" />
                  <Skeleton className="h-16 w-full bg-gray-700" />
                  <Skeleton className="h-16 w-full bg-gray-700" />
                </div>
              ) : (
                <>
                  <QuranReader 
                    ayahs={ayahs}
                    translations={translations}
                    showTranslation={showTranslation}
                    onFirstAyahLoad={setCurrentAyah}
                    surah={selectedSurah}
                    isSingleSurahView={!!selectedSurah}
                  />
                  {isFetchingMore && (
                    <div className="space-y-6 mt-6">
                      <Skeleton className="h-16 w-full bg-gray-700" />
                      <Skeleton className="h-16 w-full bg-gray-700" />
                    </div>
                  )}
                  {hasMore && !isFetchingMore && <div ref={lastVerseElementRef} style={{ height: '10px' }} />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
