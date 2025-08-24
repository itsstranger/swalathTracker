'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { BookOpenText } from 'lucide-react';

import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyHadith, type DailyHadithOutput } from '@/ai/flows/daily-hadith';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GlassCard } from './glass-card';

export const HadithBanner: FC = () => {
  const [data, setData] = useState<DailyHadithOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHadith = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDailyHadith();
        setData(result);
      } catch (err) {
        setError('Failed to load the Hadith of the day.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHadith();
  }, []);

  return (
    <GlassCard className="bg-primary/20 border-primary/30">
      <CardContent className="p-4 md:p-6">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </div>
        )}
        {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-none text-white">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {data && (
          <div>
            <div className="flex items-center gap-3 mb-3">
                <BookOpenText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-primary font-headline">Hadith of the Day</h2>
            </div>
            <div className="space-y-4">
              <blockquote className="border-r-4 border-primary pr-4 text-right" lang="ar" dir="rtl">
                <p className="text-lg text-white/90 font-arabic">{data.arabicText}</p>
              </blockquote>
              <blockquote className="border-l-4 border-primary pl-4 italic">
                <p className="text-white/90">"{data.englishTranslation}"</p>
              </blockquote>
            </div>
            <p className="mt-3 text-right text-sm text-white/70 font-medium">
              - {data.source}
            </p>
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
};
