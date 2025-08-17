// src/ai/flows/daily-insights.ts
'use server';
/**
 * @fileOverview A flow for providing personalized insights and encouragement based on daily swalath entries.
 *
 * - getDailyInsights - A function that takes daily swalath entries and returns personalized insights and encouragement.
 * - DailyInsightsInput - The input type for the getDailyInsights function.
 * - DailyInsightsOutput - The return type for the getDailyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyInsightsInputSchema = z.object({
  fajrDuhr: z.number().describe('Number of swalaths performed between Fajr and Duhr.'),
  duhrAsr: z.number().describe('Number of swalaths performed between Duhr and Asr.'),
  asrMaghrib: z.number().describe('Number of swalaths performed between Asr and Maghrib.'),
  maghribIsha: z.number().describe('Number of swalaths performed between Maghrib and Isha.'),
  ishaFajr: z.number().describe('Number of swalaths performed between Isha and Fajr.'),
  notes: z.string().optional().describe('Optional notes or reflections for the day.'),
});
export type DailyInsightsInput = z.infer<typeof DailyInsightsInputSchema>;

const DailyInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized insights and encouragement based on the daily entries.'),
});
export type DailyInsightsOutput = z.infer<typeof DailyInsightsOutputSchema>;

export async function getDailyInsights(input: DailyInsightsInput): Promise<DailyInsightsOutput> {
  return dailyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyInsightsPrompt',
  input: {schema: DailyInsightsInputSchema},
  output: {schema: DailyInsightsOutputSchema},
  prompt: `Based on the following daily swalath entries, provide personalized insights and encouragement to the user.

Fajr - Duhr: {{{fajrDuhr}}}
Duhr - Asr: {{{duhrAsr}}}
Asr - Maghrib: {{{asrMaghrib}}}
Maghrib - Isha: {{{maghribIsha}}}
Isha - Fajr: {{{ishaFajr}}}

Notes: {{{notes}}}

Focus on identifying patterns, offering specific advice for improvement, and providing motivational support to help the user stay consistent.
`,
});

const dailyInsightsFlow = ai.defineFlow(
  {
    name: 'dailyInsightsFlow',
    inputSchema: DailyInsightsInputSchema,
    outputSchema: DailyInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
