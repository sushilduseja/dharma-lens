
'use server';

// Removed enhanceDharmicGuidance and generateInsightTemplate imports as they are consolidated
import { generateDynamicGuidance, GenerateDynamicGuidanceInput, GenerateDynamicGuidanceOutput } from '@/ai/flows/generate-dynamic-guidance';

const dynamicGuidanceCache = new Map<string, GenerateDynamicGuidanceOutput>();
const CACHE_MAX_SIZE = 1000; // Keep cache size manageable


// getPersonalizedInsight and getEnhancedGuidance are no longer needed as separate functions
// Their logic is now incorporated into getDynamicGuidance

/**
 * Retrieves or generates dynamic guidance for user situations.
 * If a predefined pattern is matched, its details are used as context for the AI.
 * Utilizes an in-memory cache for previously generated responses.
 */
export async function getDynamicGuidance(input: GenerateDynamicGuidanceInput): Promise<GenerateDynamicGuidanceOutput> {
  // Create a more comprehensive cache key
  const userSituationKey = input.userSituation.toLowerCase().trim().replace(/\s+/g, ' ');
  const matchedPatternKey = input.matchedPatternName ? input.matchedPatternName.toLowerCase().trim() : 'no-match';
  const cacheKey = `${userSituationKey}-${matchedPatternKey}-${input.targetLanguage || 'en'}`;

  if (dynamicGuidanceCache.has(cacheKey)) {
    console.log("Serving dynamic guidance from cache for:", cacheKey);
    return dynamicGuidanceCache.get(cacheKey)!;
  }

  console.log("Generating new dynamic guidance for:", cacheKey, "Input:", input);
  try {
    const guidanceResult = await generateDynamicGuidance(input);

    // Basic validation of core AI outputs
    if (!guidanceResult.generated_pattern_name || 
        !guidanceResult.generated_modern_context_and_insight ||
        !guidanceResult.generated_mythological_summary ||
        !guidanceResult.generated_philosophical_explanation ||
        !guidanceResult.sanskritShloka) {
      console.warn("AI generation resulted in incomplete core content for key:", cacheKey, "Result:", guidanceResult);
      // Optionally, throw an error here or return a more structured error/fallback
      // For now, we let the flow's internal fallback handle it, but logging is important.
    }


    if (dynamicGuidanceCache.size >= CACHE_MAX_SIZE) {
      const oldestKey = dynamicGuidanceCache.keys().next().value;
      if (oldestKey) {
        dynamicGuidanceCache.delete(oldestKey);
        console.log("Cache full, evicted oldest entry:", oldestKey);
      }
    }
    dynamicGuidanceCache.set(cacheKey, guidanceResult);
    return guidanceResult;
  } catch (error: any) {
    console.error("Error in getDynamicGuidance for key:", cacheKey, "Error:", error.message);
    if (error.stack) {
        console.error("Stack trace:", error.stack);
    }
    if (error.cause) {
        console.error("Cause:", error.cause);
    }
    // Handle specific API errors with user-friendly messages
    const errorMessage = error.message || '';
    if (errorMessage.includes('404 Not Found') && errorMessage.includes('models/')) {
      throw new Error('Our spiritual AI guide is temporarily unavailable. Like the changing seasons, this too shall pass. 🍃');
    } else if (errorMessage.includes('429')) {
      throw new Error('The cosmic energies need a moment to realign. Please take a mindful pause before trying again. 🌟');
    } else if (errorMessage.includes('500')) {
      throw new Error('The universe is asking us to practice patience. Let\'s try again in a few moments. ✨');
    } else {
      // More generic error for other cases
      throw new Error(`A temporary disturbance in the flow of wisdom. Please try again. Original error: ${error.message}`);
    }
  }
}
