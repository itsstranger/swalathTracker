// src/hooks/use-prayer-times-store.ts
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format } from 'date-fns';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface PrayerTimesState {
  timings: PrayerTimings | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  lastFetched: string | null; // YYYY-MM-DD
  actions: {
    fetchPrayerTimes: (latitude: number, longitude: number) => Promise<void>;
    requestLocation: () => void;
  };
}

const usePrayerTimesStore = create<PrayerTimesState>()(
  persist(
    (set, get) => ({
      timings: null,
      status: 'idle',
      error: null,
      lastFetched: null,
      actions: {
        fetchPrayerTimes: async (latitude, longitude) => {
          set({ status: 'loading', error: null });
          const today = format(new Date(), 'yyyy-MM-dd');
          try {
            const response = await fetch(
              `https://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            if (!response.ok) {
              throw new Error('Failed to fetch prayer times.');
            }
            const data = await response.json();
            if (data.code === 200) {
              set({
                timings: data.data.timings as PrayerTimings,
                status: 'success',
                lastFetched: today,
              });
            } else {
              throw new Error(data.data || 'An unknown error occurred.');
            }
          } catch (error: any) {
            set({ status: 'error', error: error.message });
          }
        },
        requestLocation: () => {
          if (!navigator.geolocation) {
            set({ status: 'error', error: 'Geolocation is not supported by your browser.' });
            return;
          }

          set({ status: 'loading' });

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              get().actions.fetchPrayerTimes(latitude, longitude);
            },
            () => {
              set({
                status: 'error',
                error: 'Unable to retrieve your location. Please grant location permission.',
              });
            }
          );
        },
      },
    }),
    {
      name: 'prayer-times-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ timings: state.timings, lastFetched: state.lastFetched }),
    }
  )
);

export const usePrayerTimes = () => {
    const { timings, status, error, lastFetched, actions } = usePrayerTimesStore();
    
    React.useEffect(() => {
        const today = format(new Date(), 'yyyy-MM-dd');
        // Fetch only if data is not present, or if it's for a different day.
        if (!timings || lastFetched !== today) {
            actions.requestLocation();
        }
    }, [timings, lastFetched, actions]);
    
    return { timings, status, error, ...actions };
};
