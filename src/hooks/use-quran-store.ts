// src/hooks/use-quran-store.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { QuranTracking } from '@/lib/types';
import { format } from 'date-fns';

const GOAL_LOCAL_STORE_KEY = 'quran-tracker-goal';
const DAILY_DATA_LOCAL_STORE_KEY = 'quran-tracker-daily-data';

const defaultQuranState: QuranTracking = {
  dailyGoalPages: 0,
  pagesRead: 0,
  surahs: {
    yasin: false,
    mulk: false,
    waqia: false,
    rahman: false,
    kahf: false,
  },
};

export function useQuranStore() {
  const [quranData, setQuranData] = useState<QuranTracking | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const todayId = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    try {
      const storedGoal = window.localStorage.getItem(GOAL_LOCAL_STORE_KEY);
      const dailyGoalPages = storedGoal ? parseInt(storedGoal, 10) : 0;

      const storedDailyData = window.localStorage.getItem(DAILY_DATA_LOCAL_STORE_KEY);
      let dailyData = { ...defaultQuranState };

      if (storedDailyData) {
        const parsed = JSON.parse(storedDailyData);
        // Only use the data if it's for today
        if (parsed.id === todayId) {
          dailyData = { ...dailyData, ...parsed.data };
        }
      }
      
      setQuranData({ ...dailyData, dailyGoalPages });
    } catch (error) {
      console.error('Failed to load local Quran data', error);
      setQuranData(defaultQuranState);
    }
    setIsInitialized(true);
  }, [todayId]);

  const updateQuranData = useCallback((data: QuranTracking) => {
    setQuranData(data);
    try {
      // We only store pagesRead and surahs for the specific day
      const dataToStore = {
        id: todayId,
        data: {
          pagesRead: data.pagesRead,
          surahs: data.surahs,
        },
      };
      window.localStorage.setItem(DAILY_DATA_LOCAL_STORE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save Quran data to localStorage', error);
    }
  }, [todayId]);
  
  const setDailyGoal = useCallback((pages: number) => {
    setQuranData(prevData => ({ ...(prevData || defaultQuranState), dailyGoalPages: pages }));
    try {
      window.localStorage.setItem(GOAL_LOCAL_STORE_KEY, pages.toString());
    } catch (error) {
      console.error('Failed to save goal to localStorage', error);
    }
  }, []);

  return { quranData, updateQuranData, setDailyGoal, isInitialized };
}
