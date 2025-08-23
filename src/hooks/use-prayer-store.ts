// src/hooks/use-prayer-store.ts
'use client';

import { create } from 'zustand';
import type { PrayerTracking } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import {
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { format } from 'date-fns';
import type { User } from 'firebase/auth';
import { useEffect } from 'react';

const LOCAL_STORE_KEY_PREFIX = 'prayer-tracker-data-';

const defaultPrayerState: PrayerTracking = {
    fajr: { status: 'skipped', type: null, withJamaah: false },
    dhuhr: { status: 'skipped', type: null, withJamaah: false },
    asr: { status: 'skipped', type: null, withJamaah: false },
    maghrib: { status: 'skipped', type: null, withJamaah: false },
    isha: { status: 'skipped', type: null, withJamaah: false },
    rawathib: {
      beforeFajr: false,
      beforeDhuhr: false,
      afterDhuhr: false,
      beforeAsr: false,
      afterMaghrib: false,
      beforeIsha: false,
      afterIsha: false,
    },
    tahajjud: 0,
    dhuha: 0,
    witr: 0,
};

interface PrayerState {
  prayerData: PrayerTracking | null;
  isInitialized: boolean;
  user: User | null;
  actions: {
    initialize: (user: User | null, authLoading: boolean) => () => void;
    updatePrayerData: (data: PrayerTracking) => Promise<void>;
  };
}

export const usePrayerStore = create<PrayerState>((set, get) => ({
  prayerData: null,
  isInitialized: false,
  user: null,
  actions: {
    initialize: (user, authLoading) => {
      if (authLoading || get().isInitialized) {
        return () => {};
      }

      set({ user, isInitialized: false });
      const todayId = format(new Date(), 'yyyy-MM-dd');
      let unsubscribe: (() => void) | undefined;

      const getTodaysDataFromLocalStorage = () => {
        const localData = window.localStorage.getItem(`${LOCAL_STORE_KEY_PREFIX}${todayId}`);
        return localData ? JSON.parse(localData) : null;
      }

      if (user) {
        const docRef = doc(firestore, 'users', user.uid, 'prayers', todayId);
        unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            set({ prayerData: doc.data() as PrayerTracking, isInitialized: true });
          } else {
            const localData = getTodaysDataFromLocalStorage();
            if (localData) {
              set({ prayerData: localData, isInitialized: true });
              // Sync local data to firestore
              setDoc(docRef, localData, { merge: true });
              window.localStorage.removeItem(`${LOCAL_STORE_KEY_PREFIX}${todayId}`);
            } else {
              set({ prayerData: defaultPrayerState, isInitialized: true });
            }
          }
        }, (error) => {
          console.error("Error listening to Firestore:", error);
          const localData = getTodaysDataFromLocalStorage();
          set({ prayerData: localData || defaultPrayerState, isInitialized: true });
        });
      } else {
        const localData = getTodaysDataFromLocalStorage();
        set({ prayerData: localData || defaultPrayerState, isInitialized: true });
      }

      return () => {
        if (unsubscribe) unsubscribe();
        set({ isInitialized: false }); // Reset on user change
      };
    },

    updatePrayerData: async (data) => {
      set({ prayerData: data });
      const user = get().user;
      const todayId = format(new Date(), 'yyyy-MM-dd');
      if (user) {
        try {
          const docRef = doc(firestore, 'users', user.uid, 'prayers', todayId);
          await setDoc(docRef, data, { merge: true });
        } catch (error) {
          console.error("Error saving prayer data to Firestore:", error);
        }
      } else {
        try {
          window.localStorage.setItem(`${LOCAL_STORE_KEY_PREFIX}${todayId}`, JSON.stringify(data));
        } catch (error) {
          console.error('Failed to save prayer data to localStorage', error);
        }
      }
    },
  }
}));

// Hook to be used in components
export function usePrayerTracker() {
  const { user, loading: authLoading } = useAuth();
  const { prayerData, isInitialized, actions } = usePrayerStore();

  useEffect(() => {
    const unsubscribe = actions.initialize(user, authLoading);
    return () => unsubscribe();
  }, [user, authLoading, actions]);

  return { prayerData, updatePrayerData: actions.updatePrayerData, isInitialized };
}
