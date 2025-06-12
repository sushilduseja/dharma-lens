
'use server';

/**
 * @fileOverview Generates dynamic, empathetic guidance for user situations that don't match predefined patterns.
 * It focuses on understanding intent, providing actionable advice, and optionally finding a relevant shloka.
 *
 * - generateDynamicGuidance - A function that creates guidance for novel user inputs.
 * - GenerateDynamicGuidanceInput - The input type for the function.
 * - GenerateDynamicGuidanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDynamicGuidanceInputSchema = z.object({
  userSituation: z
    .string()
    .describe('The user\'s description of their situation, problem, or feelings. This can be nuanced, vague, or emotionally complex.'),
  targetLanguage: z.string().optional().describe('The target language for the AI-generated guidance (e.g., "en", "hi", "pa", "bho"). Default is "en".')
});
export type GenerateDynamicGuidanceInput = z.infer<typeof GenerateDynamicGuidanceInputSchema>;

const GenerateDynamicGuidanceOutputSchema = z.object({
  generated_pattern_name: z
    .string()
    .describe('A short, empathetic, and evocative name or title that encapsulates the essence of the user\'s situation (e.g., "Navigating Career Crossroads with a Heavy Heart", "Seeking Peace Amidst Family Tensions"). This should be in the targetLanguage.'),
  generated_modern_context_and_insight: z
    .string()
    .describe('A concise (2-4 sentences) insight that acknowledges the user\'s feelings and provides a modern context or reframe for their situation. It should be empathetic and validating. This should be in the targetLanguage.'),
  generated_dharmic_guidance: z
    .array(z.string())
    .describe('3-4 practical, actionable, and compassionate dharmic guidance steps tailored to the described situation. Each step should be a single, clear sentence or at most two very short sentences. Focus on self-reflection, ethical decision-making, and fostering inner peace or constructive action. This should be in the targetLanguage.'),
  sanskritShloka: z.string().optional().describe('If highly relevant and insightful for the specific situation, a Sanskrit shloka (PREFERABLY in Devanagari script, else IAST). Avoid generic shlokas; only include if it adds significant value.'),
  shlokaEnglishTranslation: z.string().optional().describe('English translation of the shloka, if one is provided.'),
  shlokaHindiTranslation: z.string().optional().describe('Hindi translation of the shloka (in Devanagari script), if one is provided.'),
});
export type GenerateDynamicGuidanceOutput = z.infer<typeof GenerateDynamicGuidanceOutputSchema>;

export async function generateDynamicGuidance(input: GenerateDynamicGuidanceInput): Promise<GenerateDynamicGuidanceOutput> {
  return generateDynamicGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDynamicGuidancePrompt',
  input: {
    schema: GenerateDynamicGuidanceInputSchema,
  },
  output: {
    schema: GenerateDynamicGuidanceOutputSchema,
  },
  prompt: `You are an exceptionally wise, empathetic, and insightful Dharmic counselor. Your gift is to understand the heart of a person's struggle, even if their words are vague, mixed, or emotionally charged. You respond with clarity, compassion, and actionable wisdom rooted in Dharmic principles.

The user's target language for the response is: {{{targetLanguage}}}. If no targetLanguage is specified, assume 'en' (English).

A user has described their situation:
"{{{userSituation}}}"

Your task is to generate a response in {{{targetLanguage}}}.
1.  **Understand Deeply:** Interpret the user's input, paying close attention to underlying emotions, potential trade-offs, or uncertainties they might be expressing.
2.  **Frame the Situation (in {{{targetLanguage}}}):** Create a 'generated_pattern_name'. This should be a short, empathetic, and evocative title that encapsulates the essence of what the user is going through.
3.  **Offer Insight (in {{{targetLanguage}}}):** Develop 'generated_modern_context_and_insight'. This should be 2-4 sentences. Start by acknowledging their feelings. Then, offer a modern context or a gentle reframe for their situation, helping them see it with a bit more clarity or compassion.
4.  **Provide Actionable Guidance (in {{{targetLanguage}}}):** Formulate 'generated_dharmic_guidance' consisting of 3-4 practical and compassionate steps. These steps should be:
    *   Super concise and to the point.
    *   Actionable (e.g., "Reflect on...", "Consider...", "Practice...", "Communicate...").
    *   Aligned with Dharma (promoting ethical behavior, self-awareness, peace, purpose).
    *   Directly relevant to the nuances of the user's described situation.
5.  **Find a Sacred Verse (Optional but Valued):** If, and only if, you can find a Sanskrit shloka (or a verse from a Bhakti poet if more appropriate) that is *highly specific and profoundly relevant* to this unique situation, include it along with its English and Hindi translations.
    *   \\\`sanskritShloka\\\`: In Devanagari script (preferred) or IAST.
    *   \\\`shlokaEnglishTranslation\\\`: Clear English translation.
    *   \\\`shlokaHindiTranslation\\\`: Clear Hindi translation in Devanagari script.
    *   **Prioritize specificity and relevance over just including any verse. If no verse truly fits, omit these fields.**
    *   Note: The shloka translations (English and Hindi) should remain in English and Hindi respectively, as per the output schema field names, regardless of the main {{{targetLanguage}}}.

**Important Considerations:**
*   **Empathy First:** Your tone should always be supportive and understanding.
*   **Handle Vagueness:** If the input is short or unclear, try to address the most likely underlying need or feeling. Your guidance can gently encourage further reflection.
*   **Conversational Language:** Use natural, clear, and kind language in {{{targetLanguage}}}.
*   **Focus on Action and Reflection:** The guidance should empower the user to think or act constructively.

Generate a response strictly in the requested JSON format, ensuring textual fields like 'generated_pattern_name', 'generated_modern_context_and_insight', and 'generated_dharmic_guidance' are in {{{targetLanguage}}}.
  `,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
});

const generateDynamicGuidanceFlow = ai.defineFlow(
  {
    name: 'generateDynamicGuidanceFlow',
    inputSchema: GenerateDynamicGuidanceInputSchema,
    outputSchema: GenerateDynamicGuidanceOutputSchema,
  },
  async (input: GenerateDynamicGuidanceInput) => {
    const {output} = await prompt({...input, targetLanguage: input.targetLanguage || 'en'});
    return output!;
  }
);

