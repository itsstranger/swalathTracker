'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyInsights } from '@/ai/flows/daily-insights';
import type { SwalathEntry } from '@/lib/types';
import { GlassCard } from './glass-card';

interface DailyInsightProps {
  entry: SwalathEntry | null;
}

export const DailyInsight: FC<DailyInsightProps> = ({ entry }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetInsights = async () => {
    if (!entry) return;
    setIsLoading(true);
    setError(null);
    setInsight(null);
    try {
      const input = {
        fajrDuhr: entry.fajrDuhr,
        duhrAsr: entry.duhrAsr,
        asrMaghrib: entry.asrMaghrib,
        maghribIsha: entry.maghribIsha,
        ishaFajr: entry.ishaFajr,
        notes: entry.notes,
      };
      const result = await getDailyInsights(input);
      setInsight(result.insights);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <BrainCircuit />
          AI-Powered Feedback
        </CardTitle>
        <CardDescription className="text-white/70">
          Get personalized advice and encouragement based on today's entry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGetInsights}
          disabled={!entry || isLoading}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Get Daily Insights'}
        </Button>

        {isLoading && (
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {insight && (
          <div className="mt-4 rounded-md border border-white/20 bg-white/10 p-4 text-sm">
            <p className="whitespace-pre-wrap">{insight}</p>
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
};
