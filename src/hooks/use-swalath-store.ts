// src/hooks/use-swalath-store.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SwalathEntry } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import {
  collection,
  doc,
  writeBatch,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

const LOCAL_STORE_KEY = 'swalath-tracker-data';

export function useSwalathStore() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<SwalathEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  
  // State to control sheet visibility
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [isDatePickerSheetOpen, setIsDatePickerSheetOpen] = useState(false);


  useEffect(() => {
    if (authLoading) {
      return;
    }

    let unsubscribe: (() => void) | undefined;

    if (user) {
      const userEntriesCol = collection(firestore, 'users', user.uid, 'entries');
      
      const syncLocalData = async () => {
        const localData = window.localStorage.getItem(LOCAL_STORE_KEY);
        if (localData) {
          try {
            const localEntries: SwalathEntry[] = JSON.parse(localData);
            if (localEntries.length > 0) {
              setIsSyncing(true);
              const batch = writeBatch(firestore);
              localEntries.forEach((entry) => {
                const docRef = doc(userEntriesCol, entry.id);
                batch.set(docRef, entry, { merge: true });
              });
              await batch.commit();
              window.localStorage.removeItem(LOCAL_STORE_KEY);
              setIsSyncing(false);
            }
          } catch (error) {
            console.error("Failed to sync local data to Firestore", error);
            setIsSyncing(false);
          }
        }
      };
      
      syncLocalData().then(() => {
          unsubscribe = onSnapshot(userEntriesCol, (snapshot) => {
            const firestoreEntries: SwalathEntry[] = [];
            snapshot.forEach((doc) => {
              firestoreEntries.push({ id: doc.id, ...doc.data() } as SwalathEntry);
            });
            setEntries(firestoreEntries);
            setIsInitialized(true);
          }, (error) => {
            console.error("Error listening to Firestore:", error);
            setIsInitialized(true);
          });
      });

    } else {
      try {
        const storedData = window.localStorage.getItem(LOCAL_STORE_KEY);
        setEntries(storedData ? JSON.parse(storedData) : []);
      } catch (error) {
        console.error('Failed to load local data', error);
        setEntries([]);
      }
      setIsInitialized(true);
    }
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, authLoading]);


  const addOrUpdateEntry = useCallback(async (newEntry: SwalathEntry) => {
    if (user) {
      try {
        const entryRef = doc(firestore, 'users', user.uid, 'entries', newEntry.id);
        await setDoc(entryRef, newEntry, { merge: true });
      } catch (error) {
        console.error("Error saving entry to Firestore:", error);
      }
    } else {
      setEntries((prevEntries) => {
        const entryIndex = prevEntries.findIndex((e) => e.id === newEntry.id);
        let updatedEntries;
        if (entryIndex > -1) {
          updatedEntries = [...prevEntries];
          updatedEntries[entryIndex] = newEntry;
        } else {
          updatedEntries = [...prevEntries, newEntry];
        }
        try {
          window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(updatedEntries));
        } catch (error) {
          console.error('Failed to save data to localStorage', error);
        }
        return updatedEntries;
      });
    }
  }, [user]);

  const deleteEntry = useCallback(async (id: string) => {
    if (user) {
        try {
            const entryRef = doc(firestore, 'users', user.uid, 'entries', id);
            await deleteDoc(entryRef);
        } catch (error) {
            console.error("Error deleting entry from Firestore:", error);
        }
    } else {
        setEntries((prevEntries) => {
            const updatedEntries = prevEntries.filter((e) => e.id !== id);
            try {
                window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(updatedEntries));
            } catch (error) {
                console.error('Failed to save data to localStorage', error);
            }
            return updatedEntries;
        });
    }

    if (selectedEntryId === id) {
      setSelectedEntryId(null);
    }
  }, [user, selectedEntryId]);
  
  const getSelectedEntry = useCallback(() => {
    if (!selectedEntryId) return null;
    return entries.find((e) => e.id === selectedEntryId) || null;
  }, [entries, selectedEntryId]);

  const openFormForDate = (dateId: string) => {
    setSelectedEntryId(dateId);
    setIsFormSheetOpen(true);
  };

  const openDatePicker = () => {
    setIsDatePickerSheetOpen(true);
  }


  return { 
    entries, 
    addOrUpdateEntry, 
    deleteEntry, 
    selectedEntryId, 
    setSelectedEntryId,
    getSelectedEntry,
    isInitialized,
    isSyncing,
    isFormSheetOpen,
    setIsFormSheetOpen,
    isDatePickerSheetOpen,
    setIsDatePickerSheetOpen,
    openFormForDate,
    openDatePicker,
  };
}
