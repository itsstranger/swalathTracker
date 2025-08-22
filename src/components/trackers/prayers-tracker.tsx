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
import { Sun, Moon, Sunrise, Sunset, Clock, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PrayersTrackerProps {
  prayerData: PrayerTracking;
  onUpdate: (data: PrayerTracking) => void;
}

const dailyPrayers: { id: keyof PrayerTracking; label: PrayerName, icon: React.ElementType }[] = [
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
    { id: 'afterMaghrib', label: 'After Maghrib (2)' },
    { id: 'beforeIsha', label: 'Before Isha (2)' },
    { id: 'afterIsha', label: 'After Isha (2)' },
]

const voluntaryPrayers = [
  { id: 'tahajjud', label: 'Tahajjud' },
  { id: 'dhuha', label: 'Dhuha' },
  { id: 'witr', label: 'Witr' },
];

export const PrayersTracker: FC<PrayersTrackerProps> = ({ prayerData, onUpdate }) => {
    const [currentPrayer, setCurrentPrayer] = useState<PrayerName>('Isha');
    const { toast } = useToast();

    useEffect(() => {
        setCurrentPrayer(getCurrentPrayer());
    }, []);

    const handleDailyPrayerChange = (prayer: keyof PrayerTracking, prayed: boolean) => {
        const newStatus = prayed ? 'prayed' : 'skipped';
        const newType = prayed ? 'ada' : null;

        onUpdate({
            ...prayerData,
            [prayer]: { status: newStatus, type: newType },
        });

        if (prayed) {
            toast({
                title: `${dailyPrayers.find(p => p.id === prayer)?.label} prayer marked as complete.`,
                description: "Masha'Allah! May Allah accept it.",
            });
        }
    };
    
    const handleVoluntaryPrayerChange = (prayer: 'tahajjud' | 'dhuha' | 'witr', checked: boolean) => {
        onUpdate({
            ...prayerData,
            [prayer]: checked,
        });
    }
    
    const handleRawatibChange = (prayer: keyof RawatibPrayers, checked: boolean) => {
        const newRawatib = { ...prayerData.rawathib, [prayer]: checked };
        onUpdate({
            ...prayerData,
            rawathib: newRawatib,
        });
    }

    const currentPrayerInfo = dailyPrayers.find(p => p.label === currentPrayer);

  return (
    <div className="space-y-6">
        {currentPrayerInfo && (
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Clock className="text-primary"/>
                        Current Prayer Time
                    </CardTitle>
                    <CardDescription>It's time for {currentPrayerInfo.label}. Have you prayed?</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <currentPrayerInfo.icon className="w-16 h-16 text-primary/50" />
                     <Button 
                        size="lg"
                        className="w-full"
                        variant={(prayerData[currentPrayerInfo.id as 'fajr'] as DailyPrayer)?.status === 'prayed' ? 'secondary' : 'default'}
                        onClick={() => handleDailyPrayerChange(currentPrayerInfo.id, (prayerData[currentPrayerInfo.id as 'fajr'] as DailyPrayer)?.status !== 'prayed')}
                    >
                        {(prayerData[currentPrayerInfo.id as 'fajr'] as DailyPrayer)?.status === 'prayed' ? `Undo ${currentPrayerInfo.label}` : `I have prayed ${currentPrayerInfo.label}`}
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
                return (
                    <div key={item.id} className={cn("p-4 rounded-lg transition-colors", prayer.status === 'prayed' ? 'bg-green-50' : 'bg-muted/30')}>
                        <div className="flex items-center justify-between">
                            <Label htmlFor={item.id} className="text-base font-medium flex items-center gap-2">
                                <item.icon className={cn("w-5 h-5", prayer.status === 'prayed' ? 'text-primary' : 'text-muted-foreground')} />
                                {item.label}
                            </Label>
                            <Checkbox
                                id={item.id}
                                checked={prayer.status === 'prayed'}
                                onCheckedChange={(checked) => handleDailyPrayerChange(item.id, !!checked)}
                            />
                        </div>
                        {prayer.status === 'prayed' && (
                             <RadioGroup
                                defaultValue={prayer.type || 'ada'}
                                className="flex gap-4 mt-3 pl-7"
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
            <CardContent className="grid grid-cols-2 gap-4">
                {voluntaryPrayers.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <Checkbox
                        id={item.id}
                        checked={!!prayerData[item.id as 'tahajjud']}
                        onCheckedChange={(checked) => handleVoluntaryPrayerChange(item.id as 'tahajjud' | 'dhuha' | 'witr', !!checked)}
                    />
                    <Label htmlFor={item.id} className="text-base">
                    {item.label}
                    </Label>
                </div>
                ))}
            </CardContent>
        </Card>
    </div>
  );
};
