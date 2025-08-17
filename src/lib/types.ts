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
