'use client';

import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { BarChart, MoreHorizontal, Pencil, Percent, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

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
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip } from 'recharts';
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
  SheetTrigger,
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
  const [range, setRange] = useState<Range>('month');
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<SwalathEntry | null>(null);

  const sortedEntries = useMemo(() => entries.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime()), [entries]);
  const latestEntries = useMemo(() => sortedEntries.slice(-7), [sortedEntries]);
  
  const totalSwalaths = useMemo(() => latestEntries.reduce((acc, e) => acc + e.total, 0), [latestEntries]);
  const averageCompletion = useMemo(() => {
    if (latestEntries.length === 0) return 0;
    const maxPossible = latestEntries.length * 1000; // Assuming a high number is "full completion"
    return maxPossible > 0 ? Math.round((totalSwalaths / maxPossible) * 100) : 0;
  }, [totalSwalaths, latestEntries.length]);


  const chartData = useMemo(() => {
    return latestEntries.map((entry) => ({
      date: format(new Date(entry.id), 'dd MMM'),
      total: entry.total,
    }));
  }, [latestEntries]);

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

  return (
    <>
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant={range === 'week' ? 'outline' : 'ghost'} size="sm" onClick={() => setRange('week')} className="rounded-full">Week</Button>
                <Button variant={range === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setRange('month')} className="rounded-full">Month</Button>
                <Button variant={range === 'year' ? 'outline' : 'ghost'} size="sm" onClick={() => setRange('year')} className="rounded-full">Year</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="rounded-xl shadow-none border-none bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-md">
                        <Percent className="w-3 h-3 mr-1" />
                        Average Completion
                    </Badge>
                    <span className="text-xs text-muted-foreground">{latestEntries.length > 0 ? `${format(new Date(latestEntries[0].id), 'd MMM')} - ${format(new Date(latestEntries[latestEntries.length - 1].id), 'd MMM yyyy')}` : ''}</span>
                </div>
                <p className="text-4xl font-bold">{averageCompletion}%</p>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
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
                        barSize={20}
                        >
                        {chartData.map((entry, index) => (
                          <YAxis key={`cell-${index}`} fill={index === 1 ? 'hsl(var(--primary))' : 'hsl(var(--chart-2))'} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No data for this period.</p>
                  </div>
                )}
              </CardContent>
          </Card>

          <div className="space-y-2">
              {latestEntries.slice().reverse().map(entry => (
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
        </CardContent>
      </Card>
      
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
        <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Edit Entry</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
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
