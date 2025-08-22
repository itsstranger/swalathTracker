export interface SwalathEntry {
  id: string; // YYYY-MM-DD
  fajrDuhr: number;
  duhrAsr: number;
  asrMaghrib: number;
  maghribIsha: number;
  ishaFajr: number;
  notes?: string;
  total: number;
}

export interface PrayerTracking {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  rawathib: boolean;
  tahajjud: boolean;
  dhuha: boolean;
  witr: boolean;
}

export interface QuranTracking {
  hizbJuz: string; // e.g., "1 Juz", "2 Hizb"
  yasin: boolean;
  mulk: boolean;
  waqia: boolean;
  rahman: boolean;
  kahf: boolean;
}

export interface DuaTracking {
  dhuha: boolean;
  afterMaghrib: boolean;
}

export interface DailyEntry {
  id: string; // YYYY-MM-DD
  prayers: Partial<PrayerTracking>;
  quran: Partial<QuranTracking>;
  duas: Partial<DuaTracking>;
  notes?: string;
}
