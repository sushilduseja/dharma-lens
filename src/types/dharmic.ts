
export interface ScripturalQuote {
  source: string;
  quote_type: string; // e.g., Doha, Chaupai, Shloka, Pada
  original_text: string; // Devanagari or transliterated Sanskrit/Hindi
  translation: string;
  interpretation: string;
}

export interface MythologicalArchetype {
  source?: string; // e.g., Mahabharata, Ramayana - Can be generic if purely AI generated
  summary: string; // AI generated/personalized summary
}

export interface PhilosophicalGuidance {
  core_concept?: string; // e.g., Karma Yoga, Vairagya - Can be generic if purely AI generated
  explanation: string; // AI generated/personalized explanation
}

export interface Pattern {
  pattern_id: string; // e.g., "karmic_archetype_id"
  pattern_name: string; // Short and evocative title (can be AI generated)
  keywords_and_themes?: string[]; // Keywords describing the conflict or dilemma - Optional for dynamic patterns
  modern_context: string; // 2-3 sentence description of the modern pattern (AI generated/personalized)
  mythological_archetype?: MythologicalArchetype; // Populated by AI
  philosophical_guidance?: PhilosophicalGuidance; // Populated by AI
  dharmic_guidance: string[]; // Original static guidance if any, AI enhanced version in separate state.
}
