
'use client';

import { CalendarPlus, Plus, Settings, Home, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SwalathForm } from './swalath-form';
import { useSwalathStore } from '@/hooks/use-swalath-store';
import type { SwalathEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const { addOrUpdateEntry, getSelectedEntry, setSelectedEntryId, entries, selectedEntryId } = useSwalathStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCustomDateSheetOpen, setIsCustomDateSheetOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
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

  const handleOpenFormForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedEntryId(today);
    setIsSheetOpen(true);
    setIsFabMenuOpen(false);
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
    setSelectedEntryId(formattedId);
    setIsCustomDateSheetOpen(false);
    setTimeout(() => setIsSheetOpen(true), 100);
  }

  const handleOpenCustomDate = () => {
    setIsCustomDateSheetOpen(true);
    setIsFabMenuOpen(false);
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
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Popover open={isFabMenuOpen} onOpenChange={setIsFabMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-16 h-16 text-3xl shadow-lg"
            >
              <Menu className={cn("transition-transform duration-300", { "rotate-90": isFabMenuOpen })} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 mb-2" align="center" side="top">
            <div className="flex flex-col gap-2">
               <Link href="/" passHref>
                <Button variant="ghost" onClick={() => setIsFabMenuOpen(false)} className="w-full justify-start">
                  <Home className="mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleOpenFormForToday} className="justify-start">
                <Plus className="mr-2" />
                New Entry
              </Button>
              <Button variant="ghost" onClick={handleOpenCustomDate} className="justify-start">
                <CalendarPlus className="mr-2" />
                Custom Date
              </Button>
              <Link href="/settings" passHref>
                <Button variant="ghost" onClick={() => setIsFabMenuOpen(false)} className="w-full justify-start">
                  <Settings className="mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Sheets for forms remain outside the main nav structure */}
      <Sheet open={isCustomDateSheetOpen} onOpenChange={setIsCustomDateSheetOpen}>
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
    </>
  );
};
