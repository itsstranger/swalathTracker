'use client';

import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { BarChart, CalendarDays, List, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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

interface HistoryViewProps {
  entries: SwalathEntry[];
  onEdit: (entry: SwalathEntry) => void;
  onDelete: (id: string) => void;
}

type Range = '7d' | '30d' | 'all';

const chartConfig = {
  total: {
    label: 'Total Swalaths',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export const HistoryView: FC<HistoryViewProps> = ({ entries, onEdit, onDelete }) => {
  const [range, setRange] = useState<Range>('30d');
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  
  const sortedEntries = useMemo(() => entries.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()), [entries]);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    switch (range) {
      case '7d':
        const sevenDaysAgo = subDays(now, 7);
        return sortedEntries.filter((e) => new Date(e.id) >= sevenDaysAgo);
      case '30d':
        const thirtyDaysAgo = subDays(now, 30);
        return sortedEntries.filter((e) => new Date(e.id) >= thirtyDaysAgo);
      case 'all':
      default:
        return sortedEntries;
    }
  }, [range, sortedEntries]);

  const chartData = useMemo(() => {
    return filteredEntries
      .map((entry) => ({
        date: format(new Date(entry.id), 'MMM d'),
        total: entry.total,
      }))
      .reverse(); // reverse for chronological order in chart
  }, [filteredEntries]);

  const handleDeleteConfirm = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate);
      setDeleteCandidate(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 font-headline">
                <CalendarDays />
                History
              </CardTitle>
              <CardDescription>
                Your swalath history at a glance.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={range === '7d' ? 'default' : 'outline'} size="sm" onClick={() => setRange('7d')}>7 Days</Button>
              <Button variant={range === '30d' ? 'default' : 'outline'} size="sm" onClick={() => setRange('30d')}>30 Days</Button>
              <Button variant={range === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setRange('all')}>All Time</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <BarChart className="w-5 h-5" />
                  Daily Totals
              </h3>
              {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                      <RechartsBarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                      </RechartsBarChart>
                  </ChartContainer>
              ) : (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">No data for this period.</p>
                  </div>
              )}
          </div>
          <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <List className="w-5 h-5" />
                  Detailed Log
              </h3>
              <ScrollArea className="h-96 w-full">
                  <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-center">F-D</TableHead>
                          <TableHead className="text-center">D-A</TableHead>
                          <TableHead className="text-center">A-M</TableHead>
                          <TableHead className="text-center">M-I</TableHead>
                          <TableHead className="text-center">I-F</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredEntries.length > 0 ? (
                              filteredEntries.map((entry) => (
                              <TableRow key={entry.id}>
                                  <TableCell className="font-medium">{format(new Date(entry.id), 'EEE, MMM d')}</TableCell>
                                  <TableCell className="text-center">{entry.fajrDuhr}</TableCell>
                                  <TableCell className="text-center">{entry.duhrAsr}</TableCell>
                                  <TableCell className="text-center">{entry.asrMaghrib}</TableCell>
                                  <TableCell className="text-center">{entry.maghribIsha}</TableCell>
                                  <TableCell className="text-center">{entry.ishaFajr}</TableCell>
                                  <TableCell className="text-center">
                                      <Badge variant="default">{entry.total}</Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon">
                                                  <MoreVertical />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                              <DropdownMenuItem onClick={() => onEdit(entry)}>
                                                  <Pencil className="mr-2" /> Edit
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => setDeleteCandidate(entry.id)} className="text-destructive">
                                                  <Trash2 className="mr-2" /> Delete
                                              </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                              ))
                          ) : (
                              <TableRow>
                                  <TableCell colSpan={8} className="text-center h-24">No entries yet.</TableCell>
                              </TableRow>
                          )}
                      </TableBody>
                  </Table>
              </ScrollArea>
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
    </>
  );
};
