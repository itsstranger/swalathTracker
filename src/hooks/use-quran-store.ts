// src/hooks/use-quran-store.ts
'use client';

import { create } from 'zustand';
import type { QuranTracking } from '@/lib/types';
import { format } from 'date-fns';
import type { User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { useEffect } from 'react';

const LOCAL_GOAL_KEY = 'quran-tracker-goal';
const LOCAL_DAILY_KEY_PREFIX = 'quran-tracker-daily-';

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

interface QuranState {
  quranData: QuranTracking | null;
  isInitialized: boolean;
  user: User | null;
  actions: {
    initialize: (user: User | null, authLoading: boolean) => () => void;
    updateQuranData: (data: Partial<QuranTracking>) => Promise<void>;
    setDailyGoal: (pages: number) => Promise<void>;
  };
}

export const useQuranStore = create<QuranState>((set, get) => ({
  quranData: null,
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

      const getLocalGoal = () => parseInt(window.localStorage.getItem(LOCAL_GOAL_KEY) || '0', 10);
      const getLocalDailyData = () => {
          const data = window.localStorage.getItem(`${LOCAL_DAILY_KEY_PREFIX}${todayId}`);
          return data ? JSON.parse(data) : null;
      }
      
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const dailyDocRef = doc(userDocRef, 'quran', todayId);

        const fetchData = async () => {
          try {
            const userDoc = await getDoc(userDocRef);
            const userProfile = userDoc.data() as { quranGoal?: number } | undefined;
            let goal = userProfile?.quranGoal || 0;

            const localGoal = getLocalGoal();
            if (localGoal > 0 && goal === 0) {
              goal = localGoal;
              await setDoc(userDocRef, { quranGoal: goal }, { merge: true });
              window.localStorage.removeItem(LOCAL_GOAL_KEY);
            }
            
            unsubscribe = onSnapshot(dailyDocRef, (dailyDoc) => {
              const dailyData = dailyDoc.exists() ? dailyDoc.data() : {};
              const localDailyData = getLocalDailyData();

              if(localDailyData && !dailyDoc.exists()){
                setDoc(dailyDocRef, localDailyData);
                window.localStorage.removeItem(`${LOCAL_DAILY_KEY_PREFIX}${todayId}`);
              }

              set({
                quranData: {
                  ...defaultQuranState,
                  ...localDailyData,
                  ...dailyData,
                  dailyGoalPages: goal,
                },
                isInitialized: true,
              });
            });
          } catch (error) {
            console.error("Error fetching Quran data:", error);
            set({ quranData: defaultQuranState, isInitialized: true });
          }
        };
        fetchData();

      } else {
        const dailyGoalPages = getLocalGoal();
        const dailyData = getLocalDailyData();
        set({
          quranData: { ...defaultQuranState, ...dailyData, dailyGoalPages },
          isInitialized: true,
        });
      }

      return () => {
        if (unsubscribe) unsubscribe();
        set({ isInitialized: false });
      };
    },

    updateQuranData: async (data) => {
      const currentData = get().quranData;
      if (!currentData) return;

      const newData = { ...currentData, ...data };
      set({ quranData: newData });

      const user = get().user;
      const todayId = format(new Date(), 'yyyy-MM-dd');

      const dataToSave = {
          pagesRead: newData.pagesRead,
          surahs: newData.surahs,
      };

      if (user) {
        try {
          const docRef = doc(firestore, 'users', user.uid, 'quran', todayId);
          await setDoc(docRef, dataToSave, { merge: true });
        } catch (error) {
          console.error("Error saving Quran data to Firestore:", error);
        }
      } else {
        try {
          window.localStorage.setItem(`${LOCAL_DAILY_KEY_PREFIX}${todayId}`, JSON.stringify(dataToSave));
        } catch (error) {
          console.error('Failed to save Quran data to localStorage', error);
        }
      }
    },
    
    setDailyGoal: async (pages) => {
      set({ quranData: { ...(get().quranData || defaultQuranState), dailyGoalPages: pages }});
      const user = get().user;
      if (user) {
        try {
          const docRef = doc(firestore, 'users', user.uid);
          await setDoc(docRef, { quranGoal: pages }, { merge: true });
        } catch (error) {
          console.error("Error setting daily goal in Firestore:", error);
        }
      } else {
        try {
          window.localStorage.setItem(LOCAL_GOAL_KEY, pages.toString());
        } catch (error) {
          console.error('Failed to save goal to localStorage', error);
        }
      }
    },
  },
}));

export function useQuranTracker() {
    const { user, loading: authLoading } = useAuth();
    const { quranData, isInitialized, actions } = useQuranStore();

    useEffect(() => {
        const unsubscribe = actions.initialize(user, authLoading);
        return () => unsubscribe();
    }, [user, authLoading, actions]);

    return { 
        quranData, 
        updateQuranData: actions.updateQuranData, 
        setDailyGoal: actions.setDailyGoal,
        isInitialized 
    };
}
