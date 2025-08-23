// src/components/notifications.tsx
'use client';

import { useState, useMemo } from 'react';
import { Bell, CheckCircle2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePrayerTracker } from '@/hooks/use-prayer-store';
import { useQuranTracker } from '@/hooks/use-quran-store';
import { getCurrentPrayer } from '@/lib/prayer-times';
import { Separator } from './ui/separator';
import { usePrayerTimes } from '@/hooks/use-prayer-times-store';

interface Notification {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  read: boolean;
}

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { prayerData } = usePrayerTracker();
  const { quranData } = useQuranTracker();
  const { timings } = usePrayerTimes();
  const isFriday = new Date().getDay() === 5;

  const notifications = useMemo(() => {
    const newNotifications: Notification[] = [];
    
    // Prayer notification
    const currentPrayer = getCurrentPrayer(timings);
    const prayerInfo = prayerData?.[currentPrayer.toLowerCase() as 'fajr'];
    if (prayerInfo && prayerInfo.status !== 'prayed') {
      const prayerTime = timings?.[currentPrayer];
      newNotifications.push({
        id: 'prayer-time',
        icon: Sun,
        title: `Time for ${currentPrayer}`,
        description: `It's time to perform the ${currentPrayer} prayer. ${prayerTime ? `(at ${prayerTime})` : ''}`,
        read: false,
      });
    }

    // Quran goal notification
    if (quranData && quranData.dailyGoalPages > 0 && quranData.pagesRead >= quranData.dailyGoalPages) {
        newNotifications.push({
            id: 'quran-goal',
            icon: CheckCircle2,
            title: 'Quran Goal Met!',
            description: "Masha'Allah! You've completed your daily Quran reading goal.",
            read: false,
        });
    }

    // Friday Kahf notification
    if (isFriday && !quranData?.surahs.kahf) {
        newNotifications.push({
            id: 'kahf-reminder',
            icon: Moon,
            title: 'Friday Reminder',
            description: "Don't forget to read Surah Al-Kahf today.",
            read: false,
        });
    }

    if (newNotifications.length === 0) {
        newNotifications.push({
            id: 'no-notifications',
            icon: CheckCircle2,
            title: 'All caught up!',
            description: "You have no new notifications.",
            read: true,
        })
    }

    return newNotifications;
  }, [prayerData, quranData, isFriday, timings, isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-4">
            <h3 className="text-lg font-medium">Notifications</h3>
        </div>
        <Separator />
        <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification, index) => (
                <div key={notification.id}>
                    <div className="flex items-start gap-4 p-4">
                        <notification.icon className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="space-y-1">
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
