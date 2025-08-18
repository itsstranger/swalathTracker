
'use client';

import { BarChart3, Calendar, Plus, Settings, CalendarPlus } from 'lucide-react';
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
import { format, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

export const BottomNav = () => {
  const { addOrUpdateEntry, getSelectedEntry, setSelectedEntryId, entries, selectedEntryId } = useSwalathStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCustomDateSheetOpen, setIsCustomDateSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isClient, setIsClient] = useState(false);
  const selectedEntry = getSelectedEntry();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = (entry: SwalathEntry) => {
    addOrUpdateEntry(entry);
    setSelectedEntryId(null);
    setIsSheetOpen(false);
    setIsCustomDateSheetOpen(false);
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

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const formattedId = format(date, 'yyyy-MM-dd');
    const existingEntry = entries.find(e => e.id === formattedId);
    if (existingEntry) {
      setSelectedEntryId(existingEntry.id);
    } else {
      setSelectedEntryId(formattedId);
    }
    setIsCustomDateSheetOpen(false);
    setTimeout(() => setIsSheetOpen(true), 100);
  }

  if (!isClient) {
    return null; 
  }

  const parseDateAsLocal = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const entryDate = selectedEntryId ? parseDateAsLocal(selectedEntryId) : new Date();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-sm border-t">
      <div className="container mx-auto h-full">
        <div className="flex justify-between items-center h-full">
          <Button variant="ghost" className="flex flex-col h-auto p-2">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Today</span>
          </Button>
          
          <Sheet open={isCustomDateSheetOpen} onOpenChange={setIsCustomDateSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex flex-col h-auto p-2">
                <CalendarPlus className="w-6 h-6" />
                <span className="text-xs">Custom Date</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl p-0">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-2xl font-bold">Select a Date</SheetTitle>
                    <SheetDescription>
                        Choose a day to add or edit an entry.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex justify-center p-4">
                    <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleCustomDateSelect}
                        className="rounded-md border"
                        disabled={(date) => date > new Date()}
                    />
                </div>
            </SheetContent>
          </Sheet>

          <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button size="lg" className="rounded-full w-16 h-16 text-3xl shadow-lg" onClick={handleOpenForm}>
                    <Plus />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl h-[90vh] flex flex-col p-0">
              <SheetHeader className="p-6 pb-2">
                <SheetTitle className="text-2xl font-bold">
                  {entries.some(e => e.id === selectedEntry?.id) ? 'Edit Entry' : "New Entry"}
                </SheetTitle>
                <SheetDescription>
                  {format(entryDate, "EEEE, MMMM d, yyyy")}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto px-6">
                <SwalathForm
                  entry={selectedEntry}
                  selectedEntryId={selectedEntryId}
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
