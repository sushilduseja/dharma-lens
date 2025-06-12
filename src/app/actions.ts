
'use server';

import { enhanceDharmicGuidance, EnhanceDharmicGuidanceInput, EnhanceDharmicGuidanceOutput } from '@/ai/flows/enhance-dharmic-guidance';
import { generateInsightTemplate, GenerateInsightTemplateInput, GenerateInsightTemplateOutput } from '@/ai/flows/generate-insight-template';
import { generateDynamicGuidance, GenerateDynamicGuidanceInput, GenerateDynamicGuidanceOutput } from '@/ai/flows/generate-dynamic-guidance';

const dynamicGuidanceCache = new Map<string, GenerateDynamicGuidanceOutput>();
const CACHE_MAX_SIZE = 1000;


export async function getPersonalizedInsight(input: GenerateInsightTemplateInput): Promise<GenerateInsightTemplateOutput> {
  try {
    return await generateInsightTemplate(input);
  } catch (error: any)
  {
    console.error("Error in getPersonalizedInsight:", error.message);
    if (error.stack) {
        console.error("Stack trace:", error.stack);
    }
    if (error.cause) {
        console.error("Cause:", error.cause);
    }
    throw new Error(`Failed to generate personalized insight. AI consultation might be momentarily paused. Original error: ${error.message}`);
  }
}

export async function getEnhancedGuidance(input: EnhanceDharmicGuidanceInput): Promise<EnhanceDharmicGuidanceOutput> {
   try {
    return await enhanceDharmicGuidance(input);
  } catch (error: any) {
    console.error("Error in getEnhancedGuidance:", error.message);
    if (error.stack) {
        console.error("Stack trace:", error.stack);
    }
    if (error.cause) {
        console.error("Cause:", error.cause);
    }
    throw new Error(`Failed to enhance dharmic guidance. The ancient scrolls are currently being deciphered. Original error: ${error.message}`);
  }
}

/**
 * Retrieves or generates dynamic guidance for user situations that don't match predefined patterns.
 * Utilizes an in-memory cache for previously generated responses.
 */
export async function getDynamicGuidance(input: GenerateDynamicGuidanceInput): Promise<GenerateDynamicGuidanceOutput> {
  const cacheKey = `${input.userSituation.toLowerCase().trim().replace(/\s+/g, ' ')}-${input.targetLanguage || 'en'}`;

  if (dynamicGuidanceCache.has(cacheKey)) {
    console.log("Serving dynamic guidance from cache for:", cacheKey);
    return dynamicGuidanceCache.get(cacheKey)!;
  }

  console.log("Generating new dynamic guidance for:", cacheKey);
  try {
    const guidanceResult = await generateDynamicGuidance(input);

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
    console.error("Error in getDynamicGuidance:", error.message);
    if (error.stack) {
        console.error("Stack trace:", error.stack);
    }
    if (error.cause) {
        console.error("Cause:", error.cause);
    }
    throw new Error(`Failed to generate dynamic guidance. The AI counselor might be meditating. Original error: ${error.message}`);
  }
}

