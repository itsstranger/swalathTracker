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

export type PrayerStatus = 'prayed' | 'missed' | 'skipped';
export type PrayerType = 'ada' | 'qaza' | null;

export interface DailyPrayer {
  status: PrayerStatus;
  type: PrayerType;
}

export interface RawatibPrayers {
  beforeFajr: boolean;
  beforeDhuhr: boolean;
  afterDhuhr: boolean;
  afterMaghrib: boolean;
  beforeIsha: boolean;
  afterIsha: boolean;
}

export interface PrayerTracking {
  fajr: DailyPrayer;
  dhuhr: DailyPrayer;
  asr: DailyPrayer;
  maghrib: DailyPrayer;
  isha: DailyPrayer;
  rawathib: RawatibPrayers;
  tahajjud: number;
  dhuha: number;
  witr: number;
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
