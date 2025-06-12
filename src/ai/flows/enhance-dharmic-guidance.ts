
// Use server directive allows for server-side execution in a React environment.
'use server';

/**
 * @fileOverview Enhances the Dharmic Guidance section with tailored and actionable advice using GenAI,
 * including a relevant Sanskrit shloka with translations.
 *
 * - enhanceDharmicGuidance - A function that enhances the dharmic guidance based on user input.
 * - EnhanceDharmicGuidanceInput - The input type for the enhanceDharmicGuidance function.
 * - EnhanceDharmicGuidanceOutput - The return type for the enhanceDharmicGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceDharmicGuidanceInputSchema = z.object({
  situationDescription: z
    .string()
    .describe('A description of the user\'s current situation or challenge.'),
  patternIdentified: z
    .string()
    .describe('The identified archetypal pattern that matches the user\'s situation.'),
  mythologicalSummary: z
    .string()
    .describe('A summary of the mythological story related to the identified pattern.'),
  currentGuidance: z
    .array(z.string())
    .describe('The existing dharmic guidance steps provided to the user.'),
  targetLanguage: z.string().optional().describe('The target language for the AI-generated guidance (e.g., "en", "hi", "pa", "bho"). Default is "en".')
});
export type EnhanceDharmicGuidanceInput = z.infer<typeof EnhanceDharmicGuidanceInputSchema>;

const EnhanceDharmicGuidanceOutputSchema = z.object({
  enhancedGuidance: z
    .array(z.string())
    .describe('Enhanced dharmic guidance steps tailored to the user\'s situation. Aim for 3-4 impactful steps. Each step should be a single, clear, actionable sentence, or at most two very short sentences. This should be in the targetLanguage.'),
  sanskritShloka: z.string().optional().describe('A relevant Sanskrit shloka, PREFERABLY in Devanagari script. If Devanagari is not possible, use IAST romanization.'),
  shlokaEnglishTranslation: z.string().optional().describe('English translation of the shloka.'),
  shlokaHindiTranslation: z.string().optional().describe('Hindi translation of the shloka, in Devanagari script.'),
});
export type EnhanceDharmicGuidanceOutput = z.infer<typeof EnhanceDharmicGuidanceOutputSchema>;

export async function enhanceDharmicGuidance(input: EnhanceDharmicGuidanceInput): Promise<EnhanceDharmicGuidanceOutput> {
  return enhanceDharmicGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceDharmicGuidancePrompt',
  input: {
    schema: EnhanceDharmicGuidanceInputSchema,
  },
  output: {
    schema: EnhanceDharmicGuidanceOutputSchema,
  },
  prompt: `You are a Dharmic counselor, skilled in providing practical guidance rooted in Hindu philosophical principles.
The Hindu scriptural tradition, including the Bhagavad Gita, Upanishads, Puranas, and works of Bhakti poets, offers a vast repository of insights. The Gita emphasizes equanimity over mere endurance of suffering. The Upanishads provide wisdom for modern anxieties and cultivating compassion. The Puranas convey complex truths accessibly, revealing moral complexities and flawed divine figures, offering profound lessons about human nature and karma.
Your role is to leverage AI to help unlock these profound teachings and provide tailored, actionable advice.

The user's target language for the response is: {{{targetLanguage}}}. If no targetLanguage is specified, assume 'en' (English).

Based on the user's situation, the identified archetypal pattern, and the mythological summary, enhance the existing dharmic guidance steps.

Situation Description: {{{situationDescription}}}
Pattern Identified: {{{patternIdentified}}}
Mythological Summary: {{{mythologicalSummary}}}
Current Guidance:{{#each currentGuidance}}\n - {{{this}}}{{/each}}

Provide enhanced guidance steps that are SUPER CONCISE, PUNCHY, and TO THE POINT, in the {{{targetLanguage}}}.
- Offer specific, practical actions in alignment with Dharma, using impactful and direct language in {{{targetLanguage}}}.
- Promote self-awareness, ethical decision-making, and a sense of purpose with brevity, in {{{targetLanguage}}}.
- Draw upon the depth of Hindu wisdom to address contemporary challenges, fostering equanimity and compassion.
- Each step MUST be a single, clear, actionable sentence, or at most two very short, impactful sentences, in {{{targetLanguage}}}.
- Aim for a total of 3-4 highly impactful guidance steps. Less, more powerful words.

Return the enhanced guidance steps as a numbered list.

Crucially, select a Sanskrit shloka (or a verse from a Bhakti poet if more appropriate and if a Sanskrit shloka is not directly fitting) that is **highly relevant and specific** to the provided Situation Description, Pattern Identified, and Mythological Summary. **Avoid generic shlokas unless no specific one truly applies.** Strive for variety based on the unique context of the inputs. Provide this verse and its translations with the following script requirements:
- sanskritShloka: Provide this in Devanagari script. If, for any reason, Devanagari script is not possible for the shloka, or if the verse is from a Bhakti poet in a different script, provide it in IAST (International Alphabet of Sanskrit Transliteration) format or its original script if appropriate (e.g., Hindi for a Kabir doha).
- shlokaEnglishTranslation: Provide a clear English translation. This field MUST be in English.
- shlokaHindiTranslation: Provide this in Devanagari script (for Hindi verses or as a translation for Sanskrit). This field MUST be in Hindi.
  
Ensure the 'enhancedGuidance' field in the output is in {{{targetLanguage}}}.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const enhanceDharmicGuidanceFlow = ai.defineFlow(
  {
    name: 'enhanceDharmicGuidanceFlow',
    inputSchema: EnhanceDharmicGuidanceInputSchema,
    outputSchema: EnhanceDharmicGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt({...input, targetLanguage: input.targetLanguage || 'en'});
    return output!;
  }
);

