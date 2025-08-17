
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SwalathEntry } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import {
  collection,
  doc,
  getDocs,
  writeBatch,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';


const LOCAL_STORE_KEY = 'swalath-tracker-data';

export function useSwalathStore() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<SwalathEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        setIsSyncing(true);
        // 1. Sync local data to Firestore first
        try {
          const storedData = window.localStorage.getItem(LOCAL_STORE_KEY);
          if (storedData) {
            const localEntries: SwalathEntry[] = JSON.parse(storedData);
            if (localEntries.length > 0) {
              const entriesColRef = collection(firestore, 'users', user.uid, 'entries');
              const batch = writeBatch(firestore);
              
              const querySnapshot = await getDocs(entriesColRef);
              const firestoreEntryIds = new Set(querySnapshot.docs.map(d => d.id));

              localEntries.forEach((entry) => {
                if (!firestoreEntryIds.has(entry.id)) {
                  const docRef = doc(entriesColRef, entry.id);
                  batch.set(docRef, entry);
                }
              });

              await batch.commit();
              window.localStorage.removeItem(LOCAL_STORE_KEY);
            }
          }
        } catch (error) {
          console.error("Failed to sync local data to Firestore", error);
        } finally {
          setIsSyncing(false);
        }

        // 2. Now, subscribe to Firestore for real-time updates
        const entriesCol = collection(firestore, 'users', user.uid, 'entries');
        const unsubscribe = onSnapshot(entriesCol, (snapshot) => {
          const firestoreEntries: SwalathEntry[] = [];
          snapshot.forEach((doc) => {
            firestoreEntries.push({ id: doc.id, ...doc.data() } as SwalathEntry);
          });
          setEntries(firestoreEntries);
          setIsInitialized(true);
        });
        return () => unsubscribe();

      } else {
        // User is not logged in, use localStorage
        try {
          const storedData = window.localStorage.getItem(LOCAL_STORE_KEY);
          if (storedData) {
            setEntries(JSON.parse(storedData));
          } else {
            setEntries([]);
          }
        } catch (error) {
          console.error('Failed to load data from localStorage', error);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initialize();
  }, [user]);


  const addOrUpdateEntry = useCallback(async (newEntry: SwalathEntry) => {
    if (user) {
      // Firestore logic
      try {
        const entryRef = doc(firestore, 'users', user.uid, 'entries', newEntry.id);
        await setDoc(entryRef, newEntry, { merge: true });
      } catch (error) {
        console.error("Error saving entry to Firestore:", error);
      }
    } else {
      // LocalStorage logic
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
        // Firestore logic
        try {
            const entryRef = doc(firestore, 'users', user.uid, 'entries', id);
            await deleteDoc(entryRef);
        } catch (error) {
            console.error("Error deleting entry from Firestore:", error);
        }
    } else {
        // LocalStorage logic
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
    const today = new Date().toISOString().split('T')[0];
    const entryIdToFind = selectedEntryId || today;
    return entries.find((e) => e.id === entryIdToFind) || null;
  }, [entries, selectedEntryId]);


  return { 
    entries, 
    addOrUpdateEntry, 
    deleteEntry, 
    selectedEntryId, 
    setSelectedEntryId,
    getSelectedEntry,
    isInitialized: isInitialized && !isSyncing,
  };
}
