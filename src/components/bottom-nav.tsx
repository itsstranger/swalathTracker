'use client';

import { BarChart3, Calendar, Plus, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SwalathForm } from './swalath-form';
import { useSwalathStore } from '@/hooks/use-swalath-store';
import type { SwalathEntry } from '@/lib/types';
import { useState } from 'react';

export const BottomNav = () => {
  const { addOrUpdateEntry, getSelectedEntry, setSelectedEntryId } = useSwalathStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const selectedEntry = getSelectedEntry();
  
  const handleSave = (entry: SwalathEntry) => {
    addOrUpdateEntry(entry);
    setSelectedEntryId(null);
    setIsSheetOpen(false);
  }

  const handleOpenForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedEntryId(today);
    setIsSheetOpen(true);
  }

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

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button size="lg" className="rounded-full w-16 h-16 text-3xl shadow-lg" onClick={handleOpenForm}>
                    <Plus />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-screen flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">
                  {selectedEntry?.id ? 'Edit Entry' : "Today's Entry"}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex-grow">
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
