
'use client';

import { CalendarPlus, Plus, Settings, Home, Menu, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
  const { 
    addOrUpdateEntry, 
    getSelectedEntry, 
    setSelectedEntryId, 
    isFormSheetOpen,
    setIsFormSheetOpen,
    isDatePickerSheetOpen,
    setIsDatePickerSheetOpen,
    openFormForDate,
    selectedEntryId 
  } = useSwalathStore();
  
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isClient, setIsClient] = useState(false);
  const selectedEntry = getSelectedEntry();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = (entry: SwalathEntry) => {
    addOrUpdateEntry(entry);
    setIsFormSheetOpen(false);
  }

  const handleFormSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedEntryId(null);
    }
    setIsFormSheetOpen(isOpen);
  }

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const formattedId = format(date, 'yyyy-MM-dd');
    setIsDatePickerSheetOpen(false);
    // Use a timeout to ensure the sheet has time to close before the next one opens
    setTimeout(() => openFormForDate(formattedId), 100);
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
                  Dashboard
                </Button>
              </Link>
              <Link href="/swalath" passHref>
                <Button variant="ghost" onClick={() => setIsFabMenuOpen(false)} className="w-full justify-start">
                  <Bot className="mr-2" />
                  Swalath Counter
                </Button>
              </Link>
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
      <Sheet open={isDatePickerSheetOpen} onOpenChange={setIsDatePickerSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0">
            <SheetHeader className="p-6 pb-2">
                <SheetTitle className="text-2xl font-bold">Select a Date</SheetTitle>
                <SheetDescription>
                    Choose a day to add or edit a Swalath entry.
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

      <Sheet open={isFormSheetOpen} onOpenChange={handleFormSheetOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl h-[90vh] flex flex-col p-0">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-2xl font-bold">
              {selectedEntry ? 'Edit Swalath Entry' : "New Swalath Entry"}
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
                handleFormSheetOpenChange(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
