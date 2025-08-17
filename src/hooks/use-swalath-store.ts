'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SwalathEntry } from '@/lib/types';

const STORE_KEY = 'swalath-tracker-data';

export function useSwalathStore() {
  const [entries, setEntries] = useState<SwalathEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(STORE_KEY);
      if (storedData) {
        setEntries(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    } finally {
        setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
      }
    }
  }, [entries, isInitialized]);

  const addOrUpdateEntry = useCallback((newEntry: SwalathEntry) => {
    setEntries((prevEntries) => {
      const entryIndex = prevEntries.findIndex((e) => e.id === newEntry.id);
      if (entryIndex > -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[entryIndex] = newEntry;
        return updatedEntries;
      } else {
        return [...prevEntries, newEntry];
      }
    });
  }, []);

  return { entries, addOrUpdateEntry };
}
