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
export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface DailyPrayer {
  status: PrayerStatus;
  type: PrayerType;
  withJamaah?: boolean;
}

export interface RawatibPrayers {
  beforeFajr: boolean;
  beforeDhuhr: boolean;
  afterDhuhr: boolean;
  beforeAsr: boolean;
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
  dailyGoalPages: number;
  pagesRead: number;
  surahs: {
    yasin: boolean;
    mulk: boolean;
    waqia: boolean;
    rahman: boolean;
    kahf: boolean;
  };
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

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
}
