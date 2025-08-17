
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
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  
  // This effect will only run when the authentication state has been determined.
  useEffect(() => {
    // If auth is still loading, we do nothing to prevent race conditions.
    if (authLoading) {
      return;
    }

    let unsubscribe: (() => void) | undefined;

    // This function will run when a user is properly authenticated.
    const setupFirestoreSync = (userId: string) => {
      const userEntriesCol = collection(firestore, 'users', userId, 'entries');
      const localData = window.localStorage.getItem(LOCAL_STORE_KEY);
      
      // Sync local data to Firestore if it exists
      if (localData) {
        try {
          const localEntries: SwalathEntry[] = JSON.parse(localData);
          if (localEntries.length > 0) {
            const batch = writeBatch(firestore);
            localEntries.forEach((entry) => {
              const docRef = doc(userEntriesCol, entry.id);
              batch.set(docRef, entry);
            });
            batch.commit().then(() => {
                window.localStorage.removeItem(LOCAL_STORE_KEY);
            }).catch(error => {
                console.error("Failed to commit batch:", error);
            });
          }
        } catch (error) {
          console.error("Failed to sync local data to Firestore", error);
        }
      }

      // Listen for real-time updates from Firestore
      unsubscribe = onSnapshot(userEntriesCol, (snapshot) => {
        const firestoreEntries: SwalathEntry[] = [];
        snapshot.forEach((doc) => {
          firestoreEntries.push({ id: doc.id, ...doc.data() } as SwalathEntry);
        });
        setEntries(firestoreEntries);
        setIsInitialized(true);
      }, (error) => {
        console.error("Error listening to Firestore:", error);
        setIsInitialized(true); // Still initialized, even if there's an error.
      });
    };
    
    // This function runs when the user is logged out.
    const loadLocalData = () => {
      try {
        const storedData = window.localStorage.getItem(LOCAL_STORE_KEY);
        setEntries(storedData ? JSON.parse(storedData) : []);
      } catch (error) {
        console.error('Failed to load local data after logout', error);
        setEntries([]);
      }
      setIsInitialized(true);
    };

    if (user) {
      setupFirestoreSync(user.uid);
    } else {
      loadLocalData();
    }
  
    // Cleanup function to unsubscribe from the Firestore listener on component unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, authLoading]); // This effect depends on the user and authLoading state.


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
    isInitialized,
  };
}
