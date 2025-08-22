// src/hooks/use-prayer-store.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PrayerTracking } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import {
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { format } from 'date-fns';

const LOCAL_STORE_KEY = 'prayer-tracker-data';

const defaultPrayerState: PrayerTracking = {
    fajr: { status: 'skipped', type: null },
    dhuhr: { status: 'skipped', type: null },
    asr: { status: 'skipped', type: null },
    maghrib: { status: 'skipped', type: null },
    isha: { status: 'skipped', type: null },
    rawathib: {
      beforeFajr: false,
      beforeDhuhr: false,
      afterDhuhr: false,
      afterMaghrib: false,
      afterIsha: false,
    },
    tahajjud: false,
    dhuha: false,
    witr: false,
};

export function usePrayerStore() {
  const { user, loading: authLoading } = useAuth();
  const [prayerData, setPrayerData] = useState<PrayerTracking | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const todayId = format(new Date(), 'yyyy-MM-dd');

  const getTodaysDataFromLocalStorage = () => {
    const localData = window.localStorage.getItem(LOCAL_STORE_KEY);
    if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.id === todayId) {
            // Basic migration for old rawathib structure
            if (typeof parsed.data.rawathib === 'boolean') {
              parsed.data.rawathib = defaultPrayerState.rawathib;
            }
            return parsed.data;
        }
    }
    return null;
  }

  useEffect(() => {
    if (authLoading) return;

    let unsubscribe: (() => void) | undefined;

    if (user) {
      const docRef = doc(firestore, 'users', user.uid, 'prayers', todayId);
      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data() as PrayerTracking;
          // Basic migration for old rawathib structure from firestore
          if (typeof data.rawathib === 'boolean') {
            data.rawathib = defaultPrayerState.rawathib;
          }
          setPrayerData(data);
        } else {
          const localData = getTodaysDataFromLocalStorage();
          setPrayerData(localData || defaultPrayerState);
        }
        setIsInitialized(true);
      }, (error) => {
        console.error("Error listening to Firestore:", error);
        const localData = getTodaysDataFromLocalStorage();
        setPrayerData(localData || defaultPrayerState);
        setIsInitialized(true);
      });
    } else {
      const localData = getTodaysDataFromLocalStorage();
      setPrayerData(localData || defaultPrayerState);
      setIsInitialized(true);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, authLoading, todayId]);

  const updatePrayerData = useCallback(async (data: PrayerTracking) => {
    setPrayerData(data);
    if (user) {
      try {
        const docRef = doc(firestore, 'users', user.uid, 'prayers', todayId);
        await setDoc(docRef, data, { merge: true });
      } catch (error) {
        console.error("Error saving prayer data to Firestore:", error);
      }
    } else {
      try {
        const dataToStore = { id: todayId, data };
        window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error('Failed to save prayer data to localStorage', error);
      }
    }
  }, [user, todayId]);

  return { prayerData, updatePrayerData, isInitialized };
}
