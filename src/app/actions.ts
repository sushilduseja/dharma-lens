
'use server';

import { enhanceDharmicGuidance, EnhanceDharmicGuidanceInput, EnhanceDharmicGuidanceOutput } from '@/ai/flows/enhance-dharmic-guidance';
import { generateInsightTemplate, GenerateInsightTemplateInput, GenerateInsightTemplateOutput } from '@/ai/flows/generate-insight-template';
import { generateDynamicGuidance, GenerateDynamicGuidanceInput, GenerateDynamicGuidanceOutput } from '@/ai/flows/generate-dynamic-guidance';
import type { Pattern } from '@/types/dharmic';
import fs from 'fs/promises';
import path from 'path';

// In-memory cache for dynamically generated guidance
// Key: normalized user input string
// Value: GenerateDynamicGuidanceOutput
const dynamicGuidanceCache = new Map<string, GenerateDynamicGuidanceOutput>();
// Cache size limit to prevent unbounded growth (optional, but good practice for long-running servers)
const CACHE_MAX_SIZE = 1000;


export async function getPersonalizedInsight(input: GenerateInsightTemplateInput): Promise<GenerateInsightTemplateOutput> {
  try {
    return await generateInsightTemplate(input);
  } catch (error)
  {
    console.error("Error in getPersonalizedInsight:", error);
    throw new Error("Failed to generate personalized insight.");
  }
}

export async function getEnhancedGuidance(input: EnhanceDharmicGuidanceInput): Promise<EnhanceDharmicGuidanceOutput> {
   try {
    return await enhanceDharmicGuidance(input);
  } catch (error) {
    console.error("Error in getEnhancedGuidance:", error);
    throw new Error("Failed to enhance dharmic guidance.");
  }
}

export async function getPatternsServerSide(): Promise<Pattern[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'patterns.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const patterns: Pattern[] = JSON.parse(jsonData);
    return patterns;
  } catch (error) {
    console.error("Failed to fetch patterns server-side:", error);
    throw new Error("Could not load guiding patterns from server.");
  }
}

/**
 * Retrieves or generates dynamic guidance for user situations that don't match predefined patterns.
 * Utilizes an in-memory cache for previously generated responses.
 */
export async function getDynamicGuidance(input: GenerateDynamicGuidanceInput): Promise<GenerateDynamicGuidanceOutput> {
  const normalizedInput = input.userSituation.toLowerCase().trim().replace(/\s+/g, ' ');

  if (dynamicGuidanceCache.has(normalizedInput)) {
    console.log("Serving dynamic guidance from cache for:", normalizedInput);
    return dynamicGuidanceCache.get(normalizedInput)!;
  }

  console.log("Generating new dynamic guidance for:", normalizedInput);
  try {
    const guidanceResult = await generateDynamicGuidance(input);

    // Optional: Manage cache size
    if (dynamicGuidanceCache.size >= CACHE_MAX_SIZE) {
      // Simple FIFO eviction: remove the oldest entry
      const oldestKey = dynamicGuidanceCache.keys().next().value;
      if (oldestKey) {
        dynamicGuidanceCache.delete(oldestKey);
        console.log("Cache full, evicted oldest entry:", oldestKey);
      }
    }
    dynamicGuidanceCache.set(normalizedInput, guidanceResult);
    return guidanceResult;
  } catch (error) {
    console.error("Error in getDynamicGuidance:", error);
    // Depending on how critical this is, you might re-throw or return a default error structure.
    // For now, re-throwing to be handled by the calling page.
    throw new Error("Failed to generate dynamic guidance. The AI counselor might be meditating.");
  }
}
