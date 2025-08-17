
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
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<SwalathEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  
  // Load local data on mount regardless of auth state
  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(LOCAL_STORE_KEY);
      if (storedData) {
        setEntries(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load initial data from localStorage', error);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      // Don't do anything until Firebase Auth has initialized
      return;
    }

    if (user) {
      // User is logged in
      const syncAndSubscribe = async () => {
        // 1. Sync local data to Firestore if it exists
        const storedData = window.localStorage.getItem(LOCAL_STORE_KEY);
        if (storedData) {
          try {
            const localEntries: SwalathEntry[] = JSON.parse(storedData);
            if (localEntries.length > 0) {
              const entriesColRef = collection(firestore, 'users', user.uid, 'entries');
              const batch = writeBatch(firestore);
              
              const querySnapshot = await getDocs(entriesColRef);
              const firestoreEntries = new Map(querySnapshot.docs.map(d => [d.id, d.data() as SwalathEntry]));

              localEntries.forEach((localEntry) => {
                const firestoreEntry = firestoreEntries.get(localEntry.id);
                // Only write if it doesn't exist or local is more recent (though we don't track timestamps, a simple overwrite is fine for this app)
                if (!firestoreEntry) {
                   const docRef = doc(entriesColRef, localEntry.id);
                   batch.set(docRef, localEntry);
                }
              });

              await batch.commit();
              window.localStorage.removeItem(LOCAL_STORE_KEY); // Clear local after successful sync
            }
          } catch (error) {
            console.error("Failed to sync local data to Firestore", error);
          }
        }
        
        // 2. Subscribe to Firestore for real-time updates
        const entriesCol = collection(firestore, 'users', user.uid, 'entries');
        const unsubscribe = onSnapshot(entriesCol, (snapshot) => {
          const firestoreEntries: SwalathEntry[] = [];
          snapshot.forEach((doc) => {
            firestoreEntries.push({ id: doc.id, ...doc.data() } as SwalathEntry);
          });
          setEntries(firestoreEntries);
          setIsInitialized(true);
        }, (error) => {
          console.error("Error listening to Firestore:", error);
          setIsInitialized(true); // Still initialized even if listener fails
        });

        return unsubscribe;
      };

      const unsubscribePromise = syncAndSubscribe();
      
      return () => {
        unsubscribePromise.then(unsubscribe => {
          if (unsubscribe) {
            unsubscribe();
          }
        });
      };

    } else {
      // User is not logged in, use already loaded local storage data
      setIsInitialized(true);
    }
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
