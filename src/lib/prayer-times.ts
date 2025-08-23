// src/lib/prayer-times.ts
export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Sunrise';

// Note: These are approximate, fixed times for demonstration purposes.
// A real app would use a library with location-based calculations.
const prayerTimes = {
    Fajr: { start: 0, end: 5.5 },       // 12:00 AM - 5:30 AM
    Sunrise: { start: 5.5, end: 12 },    // 5:30 AM - 12:00 PM (Represents Dhuha time)
    Dhuhr: { start: 12, end: 15.5 },     // 12:00 PM - 3:30 PM
    Asr: { start: 15.5, end: 18 },    // 3:30 PM - 6:00 PM
    Maghrib: { start: 18, end: 19.5 },   // 6:00 PM - 7:30 PM
    Isha: { start: 19.5, end: 24.01 },    // 7:30 PM - 12:00 AM+
};

export const getCurrentPrayer = (): PrayerName => {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    for (const [name, time] of Object.entries(prayerTimes)) {
        if (currentHour >= time.start && currentHour < time.end) {
            return name as PrayerName;
        }
    }
    return 'Isha'; // Default fallback
};
