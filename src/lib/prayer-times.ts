// src/lib/prayer-times.ts
import type { PrayerTimings } from '@/hooks/use-prayer-times-store';

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Sunrise';

// Order of prayers for comparison
const prayerOrder: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const getCurrentPrayer = (timings: PrayerTimings | null): PrayerName => {
    if (!timings) {
        return 'Isha'; // Default fallback if timings aren't loaded
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerMoments = prayerOrder.map(name => {
        const timeString = timings[name];
        if (!timeString) return { name, minutes: -1 };
        const [hours, minutes] = timeString.split(':').map(Number);
        return { name, minutes: hours * 60 + minutes };
    }).filter(p => p.minutes !== -1);

    // Find the next prayer
    let nextPrayerIndex = prayerMoments.findIndex(p => p.minutes > currentTime);

    // If it's after Isha, the current prayer is Isha.
    if (nextPrayerIndex === -1) {
        return 'Isha';
    }

    // The current prayer is the one before the next prayer.
    // If next prayer is Fajr (index 0), current is Isha (last in the list).
    const currentPrayerIndex = nextPrayerIndex === 0 ? prayerMoments.length - 1 : nextPrayerIndex - 1;
    
    return prayerMoments[currentPrayerIndex].name;
};
