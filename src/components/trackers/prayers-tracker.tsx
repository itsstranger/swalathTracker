// src/components/trackers/prayers-tracker.tsx
'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PrayerTracking, PrayerName, DailyPrayer, RawatibPrayers } from '@/lib/types';
import { getCurrentPrayer } from '@/lib/prayer-times';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sunrise, Sunset, Clock, Star, Heart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { usePrayerTimes } from '@/hooks/use-prayer-times-store';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface PrayersTrackerProps {
  prayerData: PrayerTracking;
  onUpdate: (data: PrayerTracking) => void;
}

const dailyPrayersConfig: { id: keyof PrayerTracking; label: PrayerName, icon: React.ElementType }[] = [
  { id: 'fajr', label: 'Fajr', icon: Sunrise },
  { id: 'dhuhr', label: 'Dhuhr', icon: Sun },
  { id: 'asr', label: 'Asr', icon: Sunset },
  { id: 'maghrib', label: 'Maghrib', icon: Moon },
  { id: 'isha', label: 'Isha', icon: Star },
];

const rawatibPrayers: { id: keyof RawatibPrayers, label: string }[] = [
    { id: 'beforeFajr', label: 'Before Fajr (2)' },
    { id: 'beforeDhuhr', label: 'Before Dhuhr (2)' },
    { id: 'afterDhuhr', label: 'After Dhuhr (2)' },
    { id: 'beforeAsr', label: 'Before Asr (2)' },
    { id: 'afterMaghrib', label: 'After Maghrib (2)' },
    { id: 'beforeIsha', label: 'Before Isha (2)' },
    { id: 'afterIsha', label: 'After Isha (2)' },
]

const voluntaryPrayers = [
  { id: 'tahajjud', label: 'Tahajjud', max: 8, step: 2 },
  { id: 'dhuha', label: 'Dhuha', max: 12, step: 2 },
  { id: 'witr', label: 'Witr', max: 11, step: 2, min: 1 },
];

export const PrayersTracker: FC<PrayersTrackerProps> = ({ prayerData, onUpdate }) => {
    const { timings, status, error, requestLocation } = usePrayerTimes();
    const [currentPrayer, setCurrentPrayer] = useState<PrayerName>('Isha');
    const [isFriday, setIsFriday] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setCurrentPrayer(getCurrentPrayer(timings));
        setIsFriday(new Date().getDay() === 5);
    }, [timings]);

    const handleDailyPrayerChange = (prayer: keyof PrayerTracking, prayed: boolean) => {
        const newStatus = prayed ? 'prayed' : 'skipped';
        const newType = prayed ? 'ada' : null;
        const withJamaah = prayed ? (prayerData[prayer as 'fajr'] as DailyPrayer)?.withJamaah || false : false;

        onUpdate({
            ...prayerData,
            [prayer]: { status: newStatus, type: newType, withJamaah },
        });

        if (prayed) {
            const prayerLabel = isFriday && prayer === 'dhuhr' ? 'Jumu\'ah' : dailyPrayersConfig.find(p => p.id === prayer)?.label;
            toast({
                title: `${prayerLabel} prayer marked as complete.`,
                description: "Masha'Allah! May Allah accept it.",
            });
        }
    };
    
    const handleVoluntaryPrayerChange = (prayer: 'tahajjud' | 'dhuha' | 'witr', count: number) => {
        onUpdate({
            ...prayerData,
            [prayer]: count,
        });
    }
    
    const handleRawatibChange = (prayer: keyof RawatibPrayers, checked: boolean) => {
        const newRawatib = { ...prayerData.rawathib, [prayer]: checked };
        onUpdate({
            ...prayerData,
            rawathib: newRawatib,
        });
    }

    const currentPrayerInfo = dailyPrayersConfig.find(p => p.label === currentPrayer);
    const isCurrentPrayerPrayed = currentPrayerInfo ? (prayerData[currentPrayerInfo.id as 'fajr'] as DailyPrayer)?.status === 'prayed' : true;
    
    const dailyPrayers = isFriday 
        ? dailyPrayersConfig.map(p => p.id === 'dhuhr' ? { ...p, label: 'Jumu\'ah' as PrayerName } : p)
        : dailyPrayersConfig;

  return (
    <div className="space-y-6">
        {status === 'loading' && <Card><CardContent className="p-4">Loading prayer times...</CardContent></Card>}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                    {error.includes('permission') && (
                         <Button onClick={requestLocation} className="mt-2" variant="secondary">
                            Enable Location
                         </Button>
                    )}
                </AlertDescription>
            </Alert>
        )}

        {currentPrayerInfo && !isCurrentPrayerPrayed && status === 'success' && (
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Clock className="text-primary"/>
                        Current Prayer Time: {timings?.[currentPrayerInfo.label]}
                    </CardTitle>
                    <CardDescription>
                        {isFriday && currentPrayerInfo.label === 'Dhuhr' ? "It's time for Jumu'ah. Have you prayed?" : `It's time for ${currentPrayerInfo.label}. Have you prayed?`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <currentPrayerInfo.icon className="w-16 h-16 text-primary/50" />
                     <Button 
                        size="lg"
                        className="w-full"
                        onClick={() => handleDailyPrayerChange(currentPrayerInfo.id, true)}
                    >
                        I have prayed {isFriday && currentPrayerInfo.label === 'Dhuhr' ? 'Jumu\'ah' : currentPrayerInfo.label}
                    </Button>
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <CardTitle>Daily Obligatory Prayers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            {dailyPrayers.map((item) => {
                const prayer = prayerData[item.id as 'fajr'] as DailyPrayer;
                const prayerTime = timings?.[item.label];
                return (
                    <div key={item.id} className={cn("p-4 rounded-lg transition-colors", prayer.status === 'prayed' ? 'bg-green-500/10' : 'bg-muted/30')}>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <Label htmlFor={item.id} className="text-base font-medium flex items-center gap-2">
                                    <item.icon className={cn("w-5 h-5", prayer.status === 'prayed' ? 'text-primary' : 'text-muted-foreground')} />
                                    {item.label}
                                </Label>
                                {prayerTime && <span className="text-xs text-muted-foreground ml-7">{prayerTime}</span>}
                            </div>
                            <Checkbox
                                id={item.id}
                                checked={prayer.status === 'prayed'}
                                onCheckedChange={(checked) => handleDailyPrayerChange(item.id, !!checked)}
                            />
                        </div>
                        {prayer.status === 'prayed' && (
                             <div className="mt-3 pl-7 space-y-3">
                                <RadioGroup
                                    defaultValue={prayer.type || 'ada'}
                                    className="flex gap-4"
                                    onValueChange={(value) => onUpdate({ ...prayerData, [item.id]: { ...prayer, type: value } })}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ada" id={`${item.id}-ada`} />
                                        <Label htmlFor={`${item.id}-ada`}>Ada</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="qaza" id={`${item.id}-qaza`} />
                                        <Label htmlFor={`${item.id}-qaza`}>Qaza</Label>
                                    </div>
                                </RadioGroup>
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`${item.id}-jamaah`} 
                                        checked={prayer.withJamaah}
                                        onCheckedChange={(checked) => onUpdate({ ...prayerData, [item.id]: { ...prayer, withJamaah: !!checked }})}
                                    />
                                    <Label htmlFor={`${item.id}-jamaah`} className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-muted-foreground"/>
                                        With Jama'ah
                                    </Label>
                                </div>
                             </div>
                        )}
                    </div>
                );
            })}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="text-pink-500" />
                    Rawatib Prayers (Sunnah Mu'akkadah)
                </CardTitle>
                <CardDescription>The confirmed voluntary prayers linked to the five daily prayers.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rawatibPrayers.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                        <Checkbox
                            id={`rawathib-${item.id}`}
                            checked={prayerData.rawathib[item.id]}
                            onCheckedChange={(checked) => handleRawatibChange(item.id, !!checked)}
                        />
                        <Label htmlFor={`rawathib-${item.id}`} className="text-base">
                            {item.label}
                        </Label>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Other Voluntary Prayers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {voluntaryPrayers.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-md">
                        <Label htmlFor={item.id} className="text-base">
                            {item.label}
                        </Label>
                        <Input
                            id={item.id}
                            type="number"
                            min={item.min || 0}
                            max={item.max}
                            step={item.step || 1}
                            placeholder="Raka'hs"
                            className="w-28"
                            value={prayerData[item.id as 'tahajjud'] || ''}
                            onChange={(e) => {
                                let value = e.target.valueAsNumber;
                                if (isNaN(value)) value = 0;
                                if (value > item.max) value = item.max;

                                if (item.id === 'witr') {
                                    if (value > 0 && value % 2 === 0) {
                                        // if user enters an even number, subtract 1 to make it odd
                                        value = Math.max(item.min || 1, value - 1);
                                    }
                                }
                                
                                handleVoluntaryPrayerChange(
                                    item.id as 'tahajjud' | 'dhuha' | 'witr',
                                    value
                                );
                            }}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  );
};
