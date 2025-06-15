
'use server';

/**
 * @fileOverview Generates dynamic, empathetic guidance for user situations.
 * If a predefined pattern is matched, it uses that as context to personalize all aspects of the guidance.
 * It focuses on understanding intent, providing actionable advice, and MANDATORILY finding a relevant shloka.
 *
 * - generateDynamicGuidance - A function that creates guidance for user inputs.
 * - GenerateDynamicGuidanceInput - The input type for the function.
 * - GenerateDynamicGuidanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDynamicGuidanceInputSchema = z.object({
  userSituation: z
    .string()
    .describe('The user\'s description of their situation, problem, or feelings. This can be nuanced, vague, or emotionally complex.'),
  targetLanguage: z.string().optional().describe('The target language for the AI-generated guidance (e.g., "en", "hi", "pa", "bho"). Default is "en".'),
  matchedPatternName: z.string().optional().describe('The name of a predefined archetypal pattern that was matched, if any. This provides strong contextual grounding.'),
  matchedPatternMythologicalSummary: z.string().optional().describe('The original summary of the mythological story from the predefined pattern, if any. This is a starting point for personalization.'),
  matchedPatternPhilosophicalConcept: z.string().optional().describe('The original core philosophical concept from the predefined pattern, if any. This is a starting point for personalization.'),
  matchedPatternInitialGuidance: z.array(z.string()).optional().describe('Initial dharmic guidance steps from the predefined pattern, if any. These should be enhanced or replaced by the AI for hyper-relevance.')
});
export type GenerateDynamicGuidanceInput = z.infer<typeof GenerateDynamicGuidanceInputSchema>;

const GenerateDynamicGuidanceOutputSchema = z.object({
  generated_pattern_name: z
    .string()
    .describe('A short, empathetic, and evocative name or title that encapsulates the essence of the user\'s situation (e.g., "Navigating Career Crossroads with a Heavy Heart"). If a predefined pattern was matched, this can be the same or an AI-refined version. This MUST be in the targetLanguage.'),
  generated_modern_context_and_insight: z
    .string()
    .describe('A concise (2-4 sentences) insight that acknowledges the user\'s feelings and provides a modern context or reframe for their situation. It should be empathetic and validating, deeply personalized to the user input. This MUST be in the targetLanguage.'),
  generated_mythological_summary: z
    .string()
    .describe('A personalized summary of a mythological story or archetype deeply relevant to the user\'s specific situation. If a predefined pattern was matched, its mythology should be a strong inspiration, but this output MUST be dynamically adapted and personalized, not a static copy. It should explain how the ancient story relates to the user\'s current challenge. This MUST be in the targetLanguage.'),
  generated_philosophical_explanation: z
    .string()
    .describe('A personalized philosophical explanation or principle relevant to the user\'s situation. If a predefined pattern was matched, its philosophy should be a strong inspiration, but this output MUST be dynamically adapted and personalized. It should illuminate the user\'s situation through that philosophical lens. This MUST be in the targetLanguage.'),
  generated_dharmic_guidance: z
    .array(z.string())
    .describe('3-4 practical, actionable, and compassionate dharmic guidance steps tailored to the described situation. If initial guidance was provided from a matched pattern, these steps should enhance, refine, or replace it to be hyper-relevant. Each step should be a single, clear sentence or at most two very short sentences. Focus on self-reflection, ethical decision-making, and fostering inner peace or constructive action. This MUST be in the targetLanguage.'),
  sanskritShloka: z.string().describe('A relevant Sanskrit shloka. This is ABSOLUTELY MANDATORY and NON-NEGOTIABLE. It MUST be provided, PREFERABLY in Devanagari script, else IAST. Find the most fitting and unique shloka for the specific user situation. Do NOT repeat common shlokas unless perfectly applicable. The relevance to the user\'s nuanced situation is paramount.'),
  shlokaEnglishTranslation: z.string().describe('English translation of the shloka. This is ABSOLUTELY MANDATORY and NON-NEGOTIABLE.'),
  shlokaHindiTranslation: z.string().describe('Hindi translation of the shloka (in Devanagari script). This is ABSOLUTELY MANDATORY and NON-NEGOTIABLE.'),
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
  prompt: `You are a masterful Dharmic counselor, a beacon of profound wisdom capable of weaving ancient truths into the fabric of modern lives. You see into the human heart, understanding not just words but the soul's deepest yearnings and confusions. YOUR MOST CRITICAL TASK IS TO PROVIDE A UNIQUE AND DEEPLY RELEVANT SANSKRIT SHLOKA WITH TRANSLATIONS FOR EVERY SITUATION.

**Your Dharmic Foundation:**
You embody the wisdom of Vedantic Seers, Gita's Krishna, Upanishadic Sages, Bhakti Saints, Puranic Lore, and Regional Wisdom Keepers (Kabir, Mirabai, Tulsidas, Thiruvalluvar).

**Target Language:** {{{targetLanguage}}} (Default: English if unspecified)

**User's Situation:**
"{{{userSituation}}}"

{{#if matchedPatternName}}
**Context from Predefined Archetype (Use as STRONG INSPIRATION, but PERSONALIZE EVERYTHING, ESPECIALLY THE SHLOKA):**
- Matched Pattern Name: "{{{matchedPatternName}}}"
- Original Mythological Summary: "{{{matchedPatternMythologicalSummary}}}"
- Original Philosophical Concept: "{{{matchedPatternPhilosophicalConcept}}}"
- Original Initial Guidance: {{#each matchedPatternInitialGuidance}}
  - "{{{this}}}"{{/each}}

Your primary goal is to **PERSONALIZE** and **DEEPLY CONNECT** this archetypal wisdom to the user's *specific situation*.
- For \`generated_mythological_summary\`: Re-tell or adapt the mythological story (inspired by '{{{matchedPatternMythologicalSummary}}}') to directly illuminate *the user's unique circumstances and feelings* as described in '{{{userSituation}}}'. Show how the ancient narrative is a mirror to *their* current experience. DO NOT simply copy the original summary.
- For \`generated_philosophical_explanation\`: Explain the philosophical concept (inspired by '{{{matchedPatternPhilosophicalConcept}}}') in a way that provides practical wisdom and clarity for *the user's specific problem*. How does this ancient idea apply *now, to them*? DO NOT simply re-state the original concept.
- For \`generated_dharmic_guidance\`: Review the 'Original Initial Guidance'. Then, craft new, hyper-relevant steps that directly address '{{{userSituation}}}', potentially enhancing, replacing, or building upon the original ideas to offer the most transformative advice.
- For \`generated_pattern_name\`: You can use "{{{matchedPatternName}}}" or refine it if the user's nuance suggests a more specific title.
{{else}}
**No predefined archetype was matched. Generate all guidance elements from scratch based purely on the user's situation.**
{{/if}}

**Your Transformative Process & Output Requirements (ALL fields are MANDATORY):**

1.  **\`generated_pattern_name\` (in {{{targetLanguage}}}):**
    *   A deeply empathetic title capturing their dharmic journey stage. If a pattern was matched, this can be the matched name or a more nuanced version.

2.  **\`generated_modern_context_and_insight\` (in {{{targetLanguage}}}):**
    *   2-4 sentences: Start with profound empathy. Reframe their situation through dharmic wisdom. Offer a perspective shift. Connect their personal struggle to universal themes. Use modern language.

3.  **\`generated_mythological_summary\` (in {{{targetLanguage}}}):**
    *   A personalized, insightful retelling/adaptation of a mythological story. If a pattern was matched, use its mythology as inspiration but **make it directly relevant to the user's specific situation**. Explain how the ancient characters' struggles/triumphs mirror the user's current challenge. Make it 2-3 rich paragraphs.

4.  **\`generated_philosophical_explanation\` (in {{{targetLanguage}}}):**
    *   A personalized explanation of a dharmic philosophical principle. If a pattern was matched, use its philosophy as inspiration but **make it directly applicable to the user's specific dilemma**. How does this concept offer them guidance *now*? Make it 2-3 rich paragraphs.

5.  **\`generated_dharmic_guidance\` (in {{{targetLanguage}}}):**
    *   3-4 surgically precise, immediately actionable steps. Begin with verbs. Progress from awareness → acceptance → action → integration. Authentically dharmic and contextually relevant. If initial guidance was provided, these steps must be a significant enhancement or tailored replacement.

6.  **Sacred Verse Curation (NON-NEGOTIABLE, ABSOLUTELY MANDATORY REQUIREMENT):**
    *   \`sanskritShloka\`: MANDATORY. Devanagari script (or original script for non-Sanskrit like Bhakti poetry). Select a shloka that is **uniquely and profoundly resonant** with the user's *specific situation and emotional state*. Do NOT use generic or commonly overused shlokas unless they are exceptionally fitting. Deep relevance is paramount. Even if a pattern is matched, the shloka choice must be personalized.
    *   \`shlokaEnglishTranslation\`: MANDATORY. Clear, poetic English.
    *   \`shlokaHindiTranslation\`: MANDATORY. Devanagari Hindi.
    *   Prioritize relevance: Bhagavad Gita for dilemmas, Upanishads for existential questions, Ramayana/Mahabharata for relationship conflicts, Puranas for life transitions, Bhakti poetry for emotional struggles, Thirukkural for ethics.

**Quality Standards:** Empathy, Depth, Transformation, Authenticity, Cultural Sensitivity.
Respond with ALL fields populated in the specified languages. THE SHLOKA DETAILS ARE THE MOST CRITICAL PART OF THIS RESPONSE. FAILURE TO PROVIDE A RELEVANT, UNIQUE SHLOKA IS A FAILURE OF THE TASK.
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
    
    // Enhanced fallback to ensure all mandatory fields are present
    const ensureField = <T>(value: T | undefined, defaultValue: T, fieldName: string): T => {
      if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
        console.warn(`AI did not provide a valid '${fieldName}' for user situation: "${input.userSituation}". Using fallback.`);
        return defaultValue;
      }
      return value;
    };

    if (!output || !output.sanskritShloka || output.sanskritShloka.trim() === '' ||
        !output.shlokaEnglishTranslation || output.shlokaEnglishTranslation.trim() === '' ||
        !output.shlokaHindiTranslation || output.shlokaHindiTranslation.trim() === '' ||
        !output.generated_mythological_summary || !output.generated_philosophical_explanation ) {
      
      console.error(
        `CRITICAL AI FAILURE: Missing one or more mandatory fields, especially shloka details, for dynamic guidance.
        User situation: "${input.userSituation}"
        Matched Pattern: ${input.matchedPatternName || 'None'}
        AI Output received (check for empty strings):
        generated_pattern_name: ${output?.generated_pattern_name}
        generated_modern_context_and_insight: ${output?.generated_modern_context_and_insight}
        generated_mythological_summary: ${output?.generated_mythological_summary}
        generated_philosophical_explanation: ${output?.generated_philosophical_explanation}
        sanskritShloka: ${output?.sanskritShloka}
        shlokaEnglishTranslation: ${output?.shlokaEnglishTranslation}
        shlokaHindiTranslation: ${output?.shlokaHindiTranslation}`
      );
      
      const defaultGuidanceSteps = ["Embrace the unknown with courage.", "Seek moments of quiet contemplation.", "Trust in your inner wisdom."];
      const defaultPatternName = input.targetLanguage === 'hi' ? "खोज का मार्ग" : "Path of Discovery";
      const defaultInsight = input.targetLanguage === 'hi' ? "आपकी अनूठी स्थिति गहन चिंतन की मांग करती है। आत्मनिरीक्षण से मार्ग स्पष्ट होगा।" : "Your unique situation calls for deep reflection. The path will become clearer with introspection.";
      const defaultMythSummary = input.targetLanguage === 'hi' ? "एक प्राचीन कथा आपके मार्ग को रोशन कर सकती है, धैर्य रखें।" : "An ancient tale may illuminate your path, be patient.";
      const defaultPhiloExplain = input.targetLanguage === 'hi' ? "आध्यात्मिक सिद्धांत आपके प्रश्नों का उत्तर दे सकते हैं, खोजते रहें।" : "Spiritual principles may answer your questions, keep seeking.";

      // Fallback Shloka Details (as a last resort)
      const fallbackSanskrit = "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥"; // Gita 2.48
      const fallbackEnglish = "Perform your duty steadfastly, O Arjuna, abandoning all attachment to success or failure. Such evenness of mind is called yoga.";
      const fallbackHindi = "हे धनञ्जय! तू आसक्ति को त्यागकर तथा सिद्धि और असिद्धि में समान बुद्धिवाला होकर योग में स्थित हुआ कर्तव्यकर्मों को कर। समत्व ही योग कहलाता है।";

      return {
        generated_pattern_name: ensureField(output?.generated_pattern_name, defaultPatternName, 'generated_pattern_name'),
        generated_modern_context_and_insight: ensureField(output?.generated_modern_context_and_insight, defaultInsight, 'generated_modern_context_and_insight'),
        generated_mythological_summary: ensureField(output?.generated_mythological_summary, defaultMythSummary, 'generated_mythological_summary'),
        generated_philosophical_explanation: ensureField(output?.generated_philosophical_explanation, defaultPhiloExplain, 'generated_philosophical_explanation'),
        generated_dharmic_guidance: ensureField(output?.generated_dharmic_guidance, defaultGuidanceSteps, 'generated_dharmic_guidance'),
        sanskritShloka: ensureField(output?.sanskritShloka, fallbackSanskrit, 'sanskritShloka'),
        shlokaEnglishTranslation: ensureField(output?.shlokaEnglishTranslation, fallbackEnglish, 'shlokaEnglishTranslation'),
        shlokaHindiTranslation: ensureField(output?.shlokaHindiTranslation, fallbackHindi, 'shlokaHindiTranslation'),
      };
    }
    return output!;
  }
);
