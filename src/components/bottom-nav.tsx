
'use client';

import { Settings, Home, Menu, Bot, ShieldCheck, BookOpen, Moon } from 'lucide-react';
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
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

export const BottomNav = () => {
  const isFormSheetOpen = useSwalathStore((state) => state.isFormSheetOpen);
  const isDatePickerSheetOpen = useSwalathStore((state) => state.isDatePickerSheetOpen);
  const selectedEntryId = useSwalathStore((state) => state.selectedEntryId);
  const { 
    addOrUpdateEntry, 
    getSelectedEntry, 
    setIsFormSheetOpen, 
    openFormForDate,
    initialize
  } = useSwalathStore((state) => state.actions);

  const setDatePickerSheetOpen = (isOpen: boolean) => {
    if (!isOpen) {
      useSwalathStore.setState({ isDatePickerSheetOpen: false });
    }
  }

  const { user, loading } = useAuth();
  
  useEffect(() => {
    const unsubscribe = initialize(user, loading);
    return () => unsubscribe?.();
  }, [user, loading, initialize]);

  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const selectedEntry = getSelectedEntry();
  const pathname = usePathname();
  const isQuranReaderPage = pathname === '/quran/read';

  const handleSave = (entry: SwalathEntry) => {
    addOrUpdateEntry(entry);
    setIsFormSheetOpen(false);
  }

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const formattedId = format(date, 'yyyy-MM-dd');
    useSwalathStore.setState({ isDatePickerSheetOpen: false });
    setTimeout(() => openFormForDate(formattedId), 100);
  }

  const parseDateAsLocal = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const entryDate = selectedEntryId ? parseDateAsLocal(selectedEntryId) : new Date();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/prayers', label: 'Prayers', icon: ShieldCheck },
    { href: '/quran', label: 'Quran', icon: BookOpen },
    { href: '/duas', label: 'Duas', icon: Moon },
    { href: '/swalath', label: 'Swalath Counter', icon: Bot },
  ];
  

  return (
    <>
      <div className={cn(
        "fixed z-50",
        isQuranReaderPage 
          ? "bottom-6 left-6" 
          : "bottom-6 left-1/2 -translate-x-1/2"
      )}>
        <Popover open={isFabMenuOpen} onOpenChange={setIsFabMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-16 h-16 text-3xl shadow-lg"
            >
              <Menu className={cn("transition-transform duration-300", { "rotate-90": isFabMenuOpen })} />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-64 p-2 mb-2 rounded-2xl" 
            align={isQuranReaderPage ? "start" : "center"} 
            side="top"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link href={href} passHref key={href}>
                  <Button
                    variant="ghost"
                    onClick={() => setIsFabMenuOpen(false)}
                    className={cn(
                      "w-full justify-start h-12 text-base",
                      pathname === href && "border-2 border-primary text-primary font-semibold"
                    )}
                  >
                    <Icon className="mr-4" />
                    {label}
                  </Button>
                </Link>
              ))}
              <Link href="/settings" passHref>
                <Button
                  variant="ghost"
                  onClick={() => setIsFabMenuOpen(false)}
                  className="w-full justify-start h-12 text-base mt-2 bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                >
                  <Settings className="mr-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Sheet open={isDatePickerSheetOpen} onOpenChange={setDatePickerSheetOpen}>
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

      <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
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
                setIsFormSheetOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
