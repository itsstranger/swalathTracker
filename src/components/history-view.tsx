
'use client';

import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { BarChart, MoreHorizontal, Pencil, Percent, Sigma, Trash2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import type { SwalathEntry } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from './ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { SwalathForm } from './swalath-form';
import { useSwalathStore } from '@/hooks/use-swalath-store';

interface HistoryViewProps {
  entries: SwalathEntry[];
  onEdit: (entry: SwalathEntry) => void;
  onDelete: (id: string) => void;
}

type Range = 'week' | 'month' | 'year';

const chartConfig = {
  total: {
    label: 'Total Swalaths',
    color: 'hsl(var(--chart-2))',
  },
  active: {
    label: 'Active Day',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export const HistoryView: FC<HistoryViewProps> = ({ entries, onEdit, onDelete }) => {
  const { addOrUpdateEntry } = useSwalathStore();
  const [range, setRange] = useState<Range>('week');
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<SwalathEntry | null>(null);

  const sortedEntries = useMemo(() => entries.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime()), [entries]);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    let daysToSubtract = 7;
    if (range === 'month') daysToSubtract = 30;
    if (range === 'year') daysToSubtract = 365;
    
    const startDate = subDays(now, daysToSubtract - 1);
    startDate.setHours(0, 0, 0, 0);

    return sortedEntries.filter(entry => {
        const entryDate = new Date(entry.id);
        entryDate.setHours(0,0,0,0);
        return entryDate >= startDate;
    });
  }, [sortedEntries, range]);

  
  const totalSwalaths = useMemo(() => filteredEntries.reduce((acc, e) => acc + e.total, 0), [filteredEntries]);
  const averageCompletion = useMemo(() => {
    if (filteredEntries.length === 0) return 0;
    const maxPossible = filteredEntries.length * 1000; // Assuming a high number is "full completion"
    return maxPossible > 0 ? Math.round((totalSwalaths / maxPossible) * 100) : 0;
  }, [totalSwalaths, filteredEntries.length]);


  const chartData = useMemo(() => {
    return filteredEntries.map((entry) => ({
      date: format(new Date(entry.id), 'dd MMM'),
      total: entry.total,
    }));
  }, [filteredEntries]);

  const handleDeleteConfirm = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate);
      setDeleteCandidate(null);
    }
  };
  
  const handleEdit = (entry: SwalathEntry) => {
    setEditingEntry(entry);
  };
  
  const handleSave = (entry: SwalathEntry) => {
    addOrUpdateEntry(entry);
    setEditingEntry(null);
  }

  const dateRangeLabel = filteredEntries.length > 0 ? `${format(new Date(filteredEntries[0].id), 'd MMM')} - ${format(new Date(filteredEntries[filteredEntries.length - 1].id), 'd MMM yyyy')}` : 'No data for this period';

  const entryDate = editingEntry?.id ? new Date(editingEntry.id) : new Date();
  
  const handleRangeChange = (newRange: Range) => {
    setRange(newRange);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">History & Stats</h2>
            <div className="flex items-center gap-2">
                <Button variant={range === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => handleRangeChange('week')} className="rounded-full">Week</Button>
                <Button variant={range === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => handleRangeChange('month')} className="rounded-full">Month</Button>
                <Button variant={range === 'year' ? 'default' : 'ghost'} size="sm" onClick={() => handleRangeChange('year')} className="rounded-full">Year</Button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Count Section */}
            <Card className="rounded-xl shadow-sm lg:col-span-1">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2 text-muted-foreground">
                        <Sigma className="w-4 h-4" />
                        Total
                    </CardTitle>
                    <p className="text-4xl font-bold">{totalSwalaths}</p>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Total swalaths for {dateRangeLabel}.</p>
                </CardContent>
            </Card>

            {/* Statistics Section */}
            <Card className="rounded-xl shadow-sm lg:col-span-2">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2 text-muted-foreground">
                        <BarChart className="w-4 h-4" />
                        Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {chartData.length > 0 ? (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center text-2xl font-bold">
                                    <Percent className="w-5 h-5 mr-2 text-primary" />
                                    {averageCompletion}%
                                </div>
                                <p className="text-xs text-muted-foreground">Average completion rate.</p>
                            </div>
                            <ChartContainer config={chartConfig} className="h-40 w-full">
                                <RechartsBarChart data={chartData} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Bar 
                                    dataKey="total"
                                    radius={10} 
                                    fill="hsl(var(--primary))"
                                    barSize={range === 'year' ? 5 : (range === 'month' ? 10 : 20)}
                                />
                                </RechartsBarChart>
                            </ChartContainer>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-[178px] border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No chart data for this period.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Logs Section */}
        <Card className="rounded-xl shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Logs</CardTitle>
                <CardDescription>Detailed entries for the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
                {filteredEntries.length > 0 ? (
                    <div className="space-y-2">
                        {filteredEntries.slice().reverse().map(entry => (
                            <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                                <div>
                                    <p className="font-semibold">{format(new Date(entry.id), 'EEEE')}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(entry.id), 'MMMM d, yyyy')}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-lg">{entry.total}</p>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <MoreHorizontal />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleEdit(entry)}>
                                                <Pencil className="mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setDeleteCandidate(entry.id)} className="text-destructive">
                                                <Trash2 className="mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No entries for this period.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={!!deleteCandidate} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the entry for {deleteCandidate && format(new Date(deleteCandidate), 'MMM d, yyyy')}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <SheetContent side="bottom" className="rounded-t-2xl h-[90vh] flex flex-col p-0">
            <SheetHeader className="p-6 pb-2">
                <SheetTitle className="text-2xl font-bold">Edit Entry</SheetTitle>
                <SheetDescription>
                  {format(entryDate, "EEEE, MMMM d, yyyy")}
                </SheetDescription>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto px-6">
              <SwalathForm
                  entry={editingEntry}
                  onSave={handleSave}
                  onCancel={() => setEditingEntry(null)}
              />
            </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
