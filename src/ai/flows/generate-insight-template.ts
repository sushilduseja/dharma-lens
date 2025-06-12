
'use server';

/**
 * @fileOverview Uses GenAI to personalize insight from mythological archetypes to the user's specific situation.
 *
 * - generateInsightTemplate - A function that generates personalized insights based on a user's situation and a mythological archetype.
 * - GenerateInsightTemplateInput - The input type for the generateInsightTemplate function.
 * - GenerateInsightTemplateOutput - The return type for the generateInsightTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightTemplateInputSchema = z.object({
  situation: z.string().describe('The user provided description of their situation.'),
  mythologicalSummary: z.string().describe('A summary of a mythological archetype.'),
  insightTemplate: z.string().describe('The "modern_context" field from the matched pattern, describing the pattern\'s relevance today. This guides the personalization.'),
  targetLanguage: z.string().optional().describe('The target language for the AI-generated insight (e.g., "en", "hi", "pa", "bho"). Default is "en".')
});
export type GenerateInsightTemplateInput = z.infer<
  typeof GenerateInsightTemplateInputSchema
>;

const GenerateInsightTemplateOutputSchema = z.object({
  personalizedInsight: z
    .string()
    .describe('A personalized insight based on the user situation and mythological archetype. This should be in the targetLanguage.'),
});
export type GenerateInsightTemplateOutput = z.infer<
  typeof GenerateInsightTemplateOutputSchema
>;

export async function generateInsightTemplate(
  input: GenerateInsightTemplateInput
): Promise<GenerateInsightTemplateOutput> {
  return generateInsightTemplateFlow(input);
}

const insightTemplatePrompt = ai.definePrompt({
  name: 'insightTemplatePrompt',
  input: {schema: GenerateInsightTemplateInputSchema},
  output: {schema: GenerateInsightTemplateOutputSchema},
  prompt: `You are an AI that specializes in providing personalized insights by relating a user's situation to mythological archetypes drawn from Hindu scriptures.
These scriptures, including the Puranas, offer profound wisdom, making complex philosophical truths accessible through narratives that often depict moral complexities and even flawed divine figures. This ancient wisdom is invaluable for understanding human nature, karma, and navigating modern anxieties with compassion.
Your goal is to help the user connect these timeless archetypes to their contemporary challenges, fostering self-reflection and a compassionate mindset.

The user's target language for the response is: {{{targetLanguage}}}. If no targetLanguage is specified, assume 'en' (English).

Based on the user's description of their situation, the summary of a mythological archetype, and the provided modern context description of the pattern, generate a personalized insight in {{{targetLanguage}}}.

User Situation: {{{situation}}}
Mythological Archetype Summary: {{{mythologicalSummary}}}
Modern Context of Pattern: {{{insightTemplate}}}

Personalized Insight (in {{{targetLanguage}}}):
Keep the personalized insight concise and impactful, ideally 2-3 sentences long. Focus on the most critical connection between the user's situation and the archetype, using the modern context as a bridge. Ensure the language used is {{{targetLanguage}}}.`,
});

const generateInsightTemplateFlow = ai.defineFlow(
  {
    name: 'generateInsightTemplateFlow',
    inputSchema: GenerateInsightTemplateInputSchema,
    outputSchema: GenerateInsightTemplateOutputSchema,
  },
  async input => {
    const {output} = await insightTemplatePrompt({...input, targetLanguage: input.targetLanguage || 'en'});
    return output!;
  }
);

