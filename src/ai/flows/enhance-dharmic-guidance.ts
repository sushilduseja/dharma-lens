
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
    .describe('Enhanced dharmic guidance steps tailored to the user\'s situation. Aim for 3-4 impactful steps. Each step should be a single, clear, actionable sentence, or at most two very short sentences. This MUST be in the targetLanguage.'),
  sanskritShloka: z.string().describe('A relevant Sanskrit shloka. This is MANDATORY. It MUST be provided, PREFERABLY in Devanagari script. If Devanagari is not possible, use IAST romanization. Find the most fitting shloka.'),
  shlokaEnglishTranslation: z.string().describe('English translation of the shloka. This is MANDATORY.'),
  shlokaHindiTranslation: z.string().describe('Hindi translation of the shloka, in Devanagari script. This is MANDATORY.'),
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
  prompt: `You are a profound Dharmic counselor, deeply versed in the vast ocean of Hindu philosophical wisdom spanning millennia. Your expertise encompasses:

**Core Scriptural Foundation:**
- Vedas (Rigveda, Samaveda, Yajurveda, Atharvaveda) - the eternal wisdom
- Upanishads (108 canonical texts) - especially Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka
- Bhagavad Gita - the supreme guide for dharmic living
- Puranas (18 Mahapuranas, 18 Upapuranas) - cosmic wisdom through divine narratives
- Itihasas (Ramayana, Mahabharata) - dharmic exemplars in human complexity

**Philosophical Schools (Darshanas):**
- Advaita, Dvaita, Vishishtadvaita Vedanta
- Sankhya, Yoga, Nyaya, Vaisheshika, Mimamsa philosophy

**Devotional & Poetic Traditions:**
- Bhakti poets: Kabir, Tulsidas, Surdas, Mirabai, Tukaram, Namdev, Eknath
- Tamil saints: Alvars, Nayanars, Thiruvalluvar (Thirukkural)
- Sufi-influenced saints: Rahim, Raskhan
- Regional wisdom: Vemana (Telugu), Sarvajna (Kannada), Narsinh Mehta (Gujarati)

Your mastery allows you to draw from this profound repository to address the deepest human struggles with precision, compassion, and transformative power.

**Target Language:** {{{targetLanguage}}} (Default: English if unspecified)

**Current Context:**
Situation: {{{situationDescription}}}
Archetypal Pattern: {{{patternIdentified}}}
Mythological Foundation: {{{mythologicalSummary}}}
Existing Guidance: {{#each currentGuidance}}\n - {{{this}}}{{/each}}

**Your Mission:**
Transform the existing guidance into laser-focused, transformative dharmic steps that cut through confusion and ignite purposeful action.

**Enhanced Guidance Requirements:**
- Each step must be a surgical strike of wisdom - one powerful sentence maximum (in {{{targetLanguage}}})
- Use active, commanding language that inspires immediate action (in {{{targetLanguage}}})
- Root every suggestion in authentic dharmic principles, not generic advice
- Address the specific nuances of their archetypal pattern
- Progress from inner awareness → ethical action → sustainable transformation
- Total: 3-4 steps that create a complete transformation pathway

**Sacred Verse Selection (MANDATORY REQUIREMENT):**
You MUST provide a relevant Sanskrit shloka, its English translation, and its Hindi translation. This is a non-negotiable part of the response. Choose a Sanskrit shloka or devotional verse with laser precision.

**Priority Sources (in order of preference for specific situations):**
1. **Bhagavad Gita** - for dharmic dilemmas, duty conflicts, spiritual confusion
2. **Upanishads** - for existential questions, self-realization, anxiety
3. **Ramayana/Mahabharata** - for relationship conflicts, moral complexities
4. **Puranic verses** - for life transitions, devotional crises
5. **Bhakti poetry** - for emotional struggles, devotional practices, surrender
6. **Thirukkural** - for ethical business, practical wisdom
7. **Regional saints** - for cultural/social conflicts, simple living

**Verse Requirements:**
- Must be hyper-relevant to the SPECIFIC situation, not generic
- Avoid overused verses (like BG 2.47) unless perfectly fitting
- Prefer lesser-known but deeply applicable verses
- For Bhakti poetry, include original script when possible

**Output Format:**
- enhancedGuidance: In {{{targetLanguage}}}
- sanskritShloka: MANDATORY. Devanagari script (or original script for non-Sanskrit).
- shlokaEnglishTranslation: MANDATORY. Clear, poetic English (ALWAYS English).
- shlokaHindiTranslation: MANDATORY. Devanagari Hindi (ALWAYS Hindi).

Respond with enhanced guidance in {{{targetLanguage}}} and appropriately sourced, MANDATORY sacred wisdom.
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
    if (!output || !output.sanskritShloka || !output.shlokaEnglishTranslation || !output.shlokaHindiTranslation) {
      console.error("AI failed to provide mandatory shloka details for enhanced guidance. User situation:", input.situationDescription, "Pattern:", input.patternIdentified);
      // Ensure a fallback or error is explicitly handled if AI misses mandatory fields despite prompt.
      // For now, we'll return the output, but strict validation or error throwing might be needed.
      return {
        enhancedGuidance: output?.enhancedGuidance || ["Guidance is being contemplated."],
        sanskritShloka: "सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः। मय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः॥", // Default fallback Gita 12.14
        shlokaEnglishTranslation: "The yogi who is ever content, self-controlled, resolute, with mind and intellect dedicated to Me—that devotee of Mine is dear to Me.",
        shlokaHindiTranslation: "जो योगी निरन्तर सन्तुष्ट रहता है, जिसने मन और इन्द्रियों सहित शरीर को वश में कर लिया है और दृढ़ निश्चय वाला है - वह अपने मन और बुद्धि को मुझमें अर्पित किये हुए मेरा भक्त मुझे प्रिय है।",
        ...output // Spread output to include whatever AI did provide
      };
    }
    return output!;
  }
);

