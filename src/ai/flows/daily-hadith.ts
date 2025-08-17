// src/ai/flows/daily-hadith.ts
'use server';
/**
 * @fileOverview A flow for providing a daily Hadith.
 *
 * - getDailyHadith - A function that returns a Hadith from Sahih al-Bukhari or Sahih Muslim.
 * - DailyHadithOutput - The return type for the getDailyHadith function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyHadithOutputSchema = z.object({
  englishTranslation: z.string().describe('The English translation of the Hadith.'),
  arabicText: z.string().describe('The original Arabic text of the Hadith.'),
  source: z.string().describe('The source of the Hadith (e.g., Sahih al-Bukhari 1).'),
});
export type DailyHadithOutput = z.infer<typeof DailyHadithOutputSchema>;

export async function getDailyHadith(): Promise<DailyHadithOutput> {
  return dailyHadithFlow();
}

const prompt = ai.definePrompt({
  name: 'dailyHadithPrompt',
  output: {schema: DailyHadithOutputSchema},
  prompt: `Provide a single, impactful Hadith for the day from either Sahih al-Bukhari or Sahih Muslim.
  
Ensure the Hadith is concise and provides a meaningful piece of wisdom or guidance.
Return the Hadith in its original Arabic text, its English translation, and its specific source, including the book and number.`,
});

const dailyHadithFlow = ai.defineFlow(
  {
    name: 'dailyHadithFlow',
    outputSchema: DailyHadithOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
