// src/hooks/use-dua-store.ts
'use client';

import { create } from 'zustand';
import type { DuaTracking } from '@/lib/types';
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

const LOCAL_STORE_KEY_PREFIX = 'dua-tracker-data-';

const defaultDuaState: DuaTracking = {
  dhuha: false,
  afterMaghrib: false,
};

interface DuaState {
  duaData: DuaTracking | null;
  isInitialized: boolean;
  user: User | null;
  actions: {
    initialize: (user: User | null, authLoading: boolean) => () => void;
    updateDuaData: (data: DuaTracking) => Promise<void>;
  };
}

export const useDuaStore = create<DuaState>((set, get) => ({
  duaData: null,
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
        const docRef = doc(firestore, 'users', user.uid, 'duas', todayId);
        unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            set({ duaData: doc.data() as DuaTracking, isInitialized: true });
          } else {
            const localData = getTodaysDataFromLocalStorage();
            if (localData) {
              set({ duaData: localData, isInitialized: true });
              setDoc(docRef, localData, { merge: true });
              window.localStorage.removeItem(`${LOCAL_STORE_KEY_PREFIX}${todayId}`);
            } else {
              set({ duaData: defaultDuaState, isInitialized: true });
            }
          }
        }, (error) => {
          console.error("Error listening to Firestore for duas:", error);
          const localData = getTodaysDataFromLocalStorage();
          set({ duaData: localData || defaultDuaState, isInitialized: true });
        });
      } else {
        const localData = getTodaysDataFromLocalStorage();
        set({ duaData: localData || defaultDuaState, isInitialized: true });
      }

      return () => {
        if (unsubscribe) unsubscribe();
        set({ isInitialized: false });
      };
    },

    updateDuaData: async (data) => {
      set({ duaData: data });
      const user = get().user;
      const todayId = format(new Date(), 'yyyy-MM-dd');
      if (user) {
        try {
          const docRef = doc(firestore, 'users', user.uid, 'duas', todayId);
          await setDoc(docRef, data, { merge: true });
        } catch (error) {
          console.error("Error saving dua data to Firestore:", error);
        }
      } else {
        try {
          window.localStorage.setItem(`${LOCAL_STORE_KEY_PREFIX}${todayId}`, JSON.stringify(data));
        } catch (error) {
          console.error('Failed to save dua data to localStorage', error);
        }
      }
    },
  }
}));

export function useDuaTracker() {
  const { user, loading: authLoading } = useAuth();
  const { duaData, isInitialized, actions } = useDuaStore();

  useEffect(() => {
    const unsubscribe = actions.initialize(user, authLoading);
    return () => unsubscribe();
  }, [user, authLoading, actions]);

  return { duaData, updateDuaData: actions.updateDuaData, isInitialized };
}
