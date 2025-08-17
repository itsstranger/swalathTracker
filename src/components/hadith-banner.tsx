'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { BookOpenText } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyHadith, type DailyHadithOutput } from '@/ai/flows/daily-hadith';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    <Card className="bg-primary/10 border-primary/20">
      <CardContent className="p-4 md:p-6">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </div>
        )}
        {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-none">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {data && (
          <div>
            <div className="flex items-center gap-3 mb-2">
                <BookOpenText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-primary font-headline">Hadith of the Day</h2>
            </div>
            <blockquote className="border-l-4 border-primary pl-4 italic">
              <p className="text-foreground/90">"{data.hadith}"</p>
            </blockquote>
            <p className="mt-2 text-right text-sm text-muted-foreground font-medium">
              - {data.source}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
