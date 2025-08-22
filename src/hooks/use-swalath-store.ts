// src/hooks/use-swalath-store.ts
'use client';

import { create } from 'zustand';
import type { SwalathEntry } from '@/lib/types';
import {
  collection,
  doc,
  writeBatch,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const LOCAL_STORE_KEY = 'swalath-tracker-data';

interface SwalathState {
  entries: SwalathEntry[];
  selectedEntryId: string | null;
  isFormSheetOpen: boolean;
  isDatePickerSheetOpen: boolean;
  isInitialized: boolean;
  isSyncing: boolean;
  user: User | null;
  actions: SwalathActions;
}

interface SwalathActions {
  initialize: (user: User | null, authLoading: boolean) => () => void;
  addOrUpdateEntry: (newEntry: SwalathEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getSelectedEntry: () => SwalathEntry | null;
  openFormForDate: (dateId: string) => void;
  openDatePicker: () => void;
  setIsFormSheetOpen: (isOpen: boolean) => void;
  setSelectedEntryId: (id: string | null) => void;
}

export const useSwalathStore = create<SwalathState>((set, get) => ({
  entries: [],
  selectedEntryId: null,
  isFormSheetOpen: false,
  isDatePickerSheetOpen: false,
  isInitialized: false,
  isSyncing: false,
  user: null,
  actions: {
    initialize: (user, authLoading) => {
      if (authLoading || get().isInitialized) {
        return () => {};
      }

      set({ user });
      let unsubscribe: (() => void) | undefined;

      if (user) {
        const userEntriesCol = collection(firestore, 'users', user.uid, 'entries');

        const syncLocalData = async () => {
          const localData = window.localStorage.getItem(LOCAL_STORE_KEY);
          if (localData) {
            try {
              const localEntries: SwalathEntry[] = JSON.parse(localData);
              if (localEntries.length > 0) {
                set({ isSyncing: true });
                const batch = writeBatch(firestore);
                localEntries.forEach((entry) => {
                  const docRef = doc(userEntriesCol, entry.id);
                  batch.set(docRef, entry, { merge: true });
                });
                await batch.commit();
                window.localStorage.removeItem(LOCAL_STORE_KEY);
                set({ isSyncing: false });
              }
            } catch (error) {
              console.error("Failed to sync local data to Firestore", error);
              set({ isSyncing: false });
            }
          }
        };

        syncLocalData().then(() => {
          unsubscribe = onSnapshot(userEntriesCol, (snapshot) => {
            const firestoreEntries: SwalathEntry[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwalathEntry));
            set({ entries: firestoreEntries, isInitialized: true });
          }, (error) => {
            console.error("Error listening to Firestore:", error);
            set({ isInitialized: true });
          });
        });
      } else {
        try {
          const storedData = window.localStorage.getItem(LOCAL_STORE_KEY);
          set({ entries: storedData ? JSON.parse(storedData) : [], isInitialized: true });
        } catch (error) {
          console.error('Failed to load local data', error);
          set({ entries: [], isInitialized: true });
        }
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    },

    addOrUpdateEntry: async (newEntry) => {
      const user = get().user;
      if (user) {
        try {
          const entryRef = doc(firestore, 'users', user.uid, 'entries', newEntry.id);
          await setDoc(entryRef, newEntry, { merge: true });
        } catch (error) {
          console.error("Error saving entry to Firestore:", error);
        }
      } else {
        const updatedEntries = get().entries.filter(e => e.id !== newEntry.id);
        updatedEntries.push(newEntry);
        set({ entries: updatedEntries });
        try {
          window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(updatedEntries));
        } catch (error) {
          console.error('Failed to save data to localStorage', error);
        }
      }
    },

    deleteEntry: async (id) => {
      const user = get().user;
      if (user) {
        try {
          const entryRef = doc(firestore, 'users', user.uid, 'entries', id);
          await deleteDoc(entryRef);
        } catch (error) {
          console.error("Error deleting entry from Firestore:", error);
        }
      } else {
        const updatedEntries = get().entries.filter((e) => e.id !== id);
        set({ entries: updatedEntries });
        try {
          window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(updatedEntries));
        } catch (error) {
          console.error('Failed to save data to localStorage', error);
        }
      }
      if (get().selectedEntryId === id) {
        set({ selectedEntryId: null });
      }
    },

    getSelectedEntry: () => {
      const { entries, selectedEntryId } = get();
      if (!selectedEntryId) return null;
      return entries.find((e) => e.id === selectedEntryId) || null;
    },

    openFormForDate: (dateId) => {
      set({ selectedEntryId: dateId, isFormSheetOpen: true, isDatePickerSheetOpen: false });
    },

    openDatePicker: () => {
      set({ isDatePickerSheetOpen: true, isFormSheetOpen: false });
    },

    setIsFormSheetOpen: (isOpen) => {
      set({ isFormSheetOpen: isOpen });
      if (!isOpen) {
        set({ selectedEntryId: null });
      }
    },

    setSelectedEntryId: (id) => set({ selectedEntryId: id }),
  },
}));
