
'use client';

import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { BarChart, CalendarDays, MoreHorizontal, Pencil, Sigma, Trash2, TrendingUp } from 'lucide-react';
import { format, parseISO, eachDayOfInterval, subMonths, eachMonthOfInterval, getMonth, getYear, isToday, differenceInDays, subDays } from 'date-fns';

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
import { Bar, BarChart as RechartsBarChart, XAxis, Cell, YAxis } from 'recharts';
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
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoryViewProps {
  entries: SwalathEntry[];
  onEdit: (entry: SwalathEntry) => void;
  onDelete: (id: string) => void;
}

type Range = 'week' | 'month' | 'year';

const chartConfig = {
  total: {
    label: 'Total Swalaths',
    color: 'hsl(var(--chart-1))',
  },
  active: {
    label: 'Active Day',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

// Helper to parse date string as local date
const parseDateAsLocal = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const HistoryView: FC<HistoryViewProps> = ({ entries, onEdit, onDelete }) => {
  const [range, setRange] = useState<Range>('week');
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);

  const sortedEntries = useMemo(() => entries.sort((a, b) => parseDateAsLocal(a.id).getTime() - parseDateAsLocal(b.id).getTime()), [entries]);

  const { filteredEntries, dateRangeLabel, totalDaysInRange } = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    let startDate: Date;
    let days = 7;

    switch (range) {
        case 'week':
            startDate = subDays(now, 6);
            days = 7;
            break;
        case 'month':
            startDate = subDays(now, 29);
            days = 30;
            break;
        case 'year':
            startDate = subMonths(now, 11);
            days = differenceInDays(now, startDate) + 1;
            break;
        default:
            startDate = subDays(now, 6);
    }
    startDate.setHours(0, 0, 0, 0);

    const relevantEntries = sortedEntries.filter(entry => {
        const entryDate = parseDateAsLocal(entry.id);
        return entryDate >= startDate && entryDate <= now;
    });

    let label = `this ${range}`;
    if (range === 'year') {
        label = `the last 12 months`
    } else if (relevantEntries.length > 0) {
      label = `${format(startDate, 'd MMM')} - ${format(now, 'd MMM yyyy')}`;
    }

    return { filteredEntries: relevantEntries, dateRangeLabel: label, totalDaysInRange: days };
  }, [sortedEntries, range]);

  
  const totalSwalaths = useMemo(() => filteredEntries.reduce((acc, e) => acc + e.total, 0), [filteredEntries]);
  const daysTracked = useMemo(() => filteredEntries.length, [filteredEntries]);
  const averagePerDay = useMemo(() => (daysTracked > 0 ? Math.round(totalSwalaths / daysTracked) : 0), [totalSwalaths, daysTracked]);

  const chartData = useMemo(() => {
    const now = new Date();
    const entriesById = new Map(entries.map(e => [e.id, e.total]));

    if (range === 'year') {
        const yearInterval = { start: subMonths(now, 11), end: now };
        const months = eachMonthOfInterval(yearInterval);
        
        return months.map(monthStart => {
            const monthEntries = entries.filter(entry => {
                const entryDate = parseDateAsLocal(entry.id);
                return getYear(entryDate) === getYear(monthStart) && getMonth(entryDate) === getMonth(monthStart);
            });
            const total = monthEntries.reduce((acc, curr) => acc + curr.total, 0);
            return {
                date: format(monthStart, 'MMM'),
                total,
                isToday: getYear(monthStart) === getYear(now) && getMonth(monthStart) === getMonth(now)
            };
        });
    }

    const daysCount = range === 'week' ? 7 : 30;
    const interval = { start: subDays(now, daysCount - 1), end: now };
    const allDays = eachDayOfInterval(interval);

    return allDays.map(day => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        return {
            date: range === 'week' ? format(day, 'eee') : format(day, 'dd'),
            total: entriesById.get(formattedDate) || 0,
            isToday: isToday(day),
        };
    });
  }, [range, entries]);

  const handleDeleteConfirm = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate);
      setDeleteCandidate(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Tabs value={range} onValueChange={(value) => setRange(value as Range)}>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-headline">History & Stats</h2>
                <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                           <Sigma className="w-4 h-4" /> Total Swalaths
                        </CardTitle>
                        <p className="text-2xl font-bold">{totalSwalaths.toLocaleString()}</p>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                           <TrendingUp className="w-4 h-4" /> Avg Per Day
                        </CardTitle>
                        <p className="text-2xl font-bold">{averagePerDay.toLocaleString()}</p>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                           <CalendarDays className="w-4 h-4" /> Days Tracked
                        </CardTitle>
                        <p className="text-2xl font-bold">{daysTracked} / {totalDaysInRange}</p>
                    </CardHeader>
                </Card>
            </div>

            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5" />
                        Activity
                    </CardTitle>
                    <CardDescription>{dateRangeLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                    {chartData.length > 0 && chartData.some(d => d.total > 0) ? (
                        <ChartContainer config={chartConfig} className="h-48 w-full">
                            <RechartsBarChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={30} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar 
                                dataKey="total"
                                radius={8}
                                barSize={range === 'year' ? 20 : (range === 'month' ? 8 : 20)}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.total > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} opacity={entry.total > 0 ? 1 : 0.2} />
                                ))}
                            </Bar>
                            </RechartsBarChart>
                        </ChartContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[208px] border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No chart data for this period.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className="text-lg">Logs</CardTitle>
                    <CardDescription>Detailed entries for the selected period.</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredEntries.length > 0 ? (
                        <div className="space-y-1">
                            {filteredEntries.slice().reverse().map(entry => (
                                <div key={entry.id} className={cn("flex items-center justify-between p-3 rounded-lg hover:bg-muted/50")}>
                                    <div>
                                        <p className="font-semibold">{format(parseDateAsLocal(entry.id), 'EEEE')}</p>
                                        <p className="text-sm text-muted-foreground">{format(parseDateAsLocal(entry.id), 'MMMM d, yyyy')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-lg">{entry.total}</p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
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
        </Tabs>
      </div>
      
      <AlertDialog open={!!deleteCandidate} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the entry for {deleteCandidate && format(parseDateAsLocal(deleteCandidate), 'MMM d, yyyy')}.
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
