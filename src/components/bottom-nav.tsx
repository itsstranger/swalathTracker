
'use client';

import { BarChart3, Calendar, Plus, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SwalathForm } from './swalath-form';
import { useSwalathStore } from '@/hooks/use-swalath-store';
import type { SwalathEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const BottomNav = () => {
  const { addOrUpdateEntry, getSelectedEntry, setSelectedEntryId, entries } = useSwalathStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const selectedEntry = getSelectedEntry();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = (entry: SwalathEntry) => {
    addOrUpdateEntry(entry);
    setSelectedEntryId(null);
    setIsSheetOpen(false);
  }

  const handleOpenForm = () => {
    if (!selectedEntry) {
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = entries.find(e => e.id === today);
      if (!existingEntry) {
        setSelectedEntryId(today);
      }
    }
    setIsSheetOpen(true);
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedEntryId(null);
    }
    setIsSheetOpen(isOpen);
  }

  if (!isClient) {
    return null; 
  }

  const entryDate = selectedEntry?.id ? new Date(selectedEntry.id) : new Date();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-sm border-t">
      <div className="container mx-auto h-full">
        <div className="flex justify-between items-center h-full">
          <Button variant="ghost" className="flex flex-col h-auto p-2">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Today</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto p-2 text-muted-foreground">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </Button>

          <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button size="lg" className="rounded-full w-16 h-16 text-3xl shadow-lg" onClick={handleOpenForm}>
                    <Plus />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl h-[90vh] flex flex-col p-0">
              <SheetHeader className="p-6 pb-2">
                <SheetTitle className="text-2xl font-bold">
                  {selectedEntry?.id ? 'Edit Entry' : "Today's Entry"}
                </SheetTitle>
                <SheetDescription>
                  {format(entryDate, "EEEE, MMMM d, yyyy")}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto px-6">
                <SwalathForm
                  entry={selectedEntry}
                  onSave={handleSave}
                  onCancel={() => {
                    setSelectedEntryId(null);
                    setIsSheetOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" className="flex flex-col h-auto p-2 text-muted-foreground">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Stats</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto p-2 text-muted-foreground">
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
