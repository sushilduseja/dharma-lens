
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
});
export type GenerateInsightTemplateInput = z.infer<
  typeof GenerateInsightTemplateInputSchema
>;

const GenerateInsightTemplateOutputSchema = z.object({
  personalizedInsight: z
    .string()
    .describe('A personalized insight based on the user situation and mythological archetype.'),
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

Based on the user's description of their situation, the summary of a mythological archetype, and the provided modern context description of the pattern, generate a personalized insight.

User Situation: {{{situation}}}
Mythological Archetype Summary: {{{mythologicalSummary}}}
Modern Context of Pattern: {{{insightTemplate}}}

Personalized Insight:
Keep the personalized insight concise and impactful, ideally 2-3 sentences long. Focus on the most critical connection between the user's situation and the archetype, using the modern context as a bridge.`,
});

const generateInsightTemplateFlow = ai.defineFlow(
  {
    name: 'generateInsightTemplateFlow',
    inputSchema: GenerateInsightTemplateInputSchema,
    outputSchema: GenerateInsightTemplateOutputSchema,
  },
  async input => {
    const {output} = await insightTemplatePrompt(input);
    return output!;
  }
);
