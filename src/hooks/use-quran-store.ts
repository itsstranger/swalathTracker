// src/hooks/use-quran-store.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { QuranTracking } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { format } from 'date-fns';

const LOCAL_STORE_KEY_PREFIX = 'quran-tracker-';
const GOAL_LOCAL_STORE_KEY = 'quran-tracker-goal';

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
  const { user, loading: authLoading } = useAuth();
  const [quranData, setQuranData] = useState<QuranTracking | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const todayId = format(new Date(), 'yyyy-MM-dd');
  const localDataKey = `${LOCAL_STORE_KEY_PREFIX}${todayId}`;

  const getLocalData = useCallback(() => {
    const goal = parseInt(window.localStorage.getItem(GOAL_LOCAL_STORE_KEY) || '0', 10);
    const dailyDataStr = window.localStorage.getItem(localDataKey);
    const dailyData = dailyDataStr ? JSON.parse(dailyDataStr) : { pagesRead: 0, surahs: defaultQuranState.surahs };
    return { ...defaultQuranState, ...dailyData, dailyGoalPages: goal };
  }, [localDataKey]);
  
  useEffect(() => {
    if (authLoading) return;

    let unsubscribe: (() => void) | undefined;
    
    if (user) {
      const todayDocRef = doc(firestore, 'users', user.uid, 'quran', todayId);
      const userDocRef = doc(firestore, 'users', user.uid);

      unsubscribe = onSnapshot(todayDocRef, async (todayDoc) => {
        let finalData: QuranTracking;
        const userDoc = await getDoc(userDocRef);
        const savedGoal = userDoc.exists() ? userDoc.data()?.quranGoal || 0 : 0;

        if (todayDoc.exists()) {
          const dailyData = todayDoc.data() as QuranTracking;
          // Ensure the goal from the user's profile is respected if today's doc is missing it
          finalData = { ...dailyData, dailyGoalPages: dailyData.dailyGoalPages || savedGoal };
        } else {
          // No entry for today, so create a new one using the saved goal
          finalData = { ...defaultQuranState, dailyGoalPages: savedGoal };
        }
        
        setQuranData(finalData);
        setIsInitialized(true);

      }, (error) => {
        console.error("Error listening to Firestore:", error);
        setQuranData(getLocalData());
        setIsInitialized(true);
      });
    } else {
      setQuranData(getLocalData());
      setIsInitialized(true);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, authLoading, todayId, getLocalData]);
  
  const updateQuranData = useCallback(async (data: QuranTracking) => {
    setQuranData(data);
    if (user) {
      try {
        const docRef = doc(firestore, 'users', user.uid, 'quran', todayId);
        await setDoc(docRef, data, { merge: true });
      } catch (error) {
        console.error("Error saving Quran data to Firestore:", error);
      }
    } else {
      try {
        const { dailyGoalPages, ...dailyData } = data;
        window.localStorage.setItem(localDataKey, JSON.stringify(dailyData));
      } catch (error) {
        console.error('Failed to save Quran data to localStorage', error);
      }
    }
  }, [user, todayId, localDataKey]);
  
  const setDailyGoal = useCallback(async (pages: number) => {
    const newQuranData = { ...(quranData || defaultQuranState), dailyGoalPages: pages };
    setQuranData(newQuranData);

    if (user) {
        try {
            // Save the goal to the main user profile for persistence across days
            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, { quranGoal: pages }, { merge: true });
            
            // Also update today's document with the new goal
            const todayDocRef = doc(firestore, 'users', user.uid, 'quran', todayId);
            await setDoc(todayDocRef, { dailyGoalPages: pages }, { merge: true });
        } catch (error) {
            console.error("Error setting daily goal in Firestore:", error);
        }
    } else {
        try {
            window.localStorage.setItem(GOAL_LOCAL_STORE_KEY, pages.toString());
        } catch (error) {
            console.error('Failed to save goal to localStorage', error);
        }
    }
  }, [user, quranData, todayId]);

  return { quranData, updateQuranData, setDailyGoal, isInitialized };
}
