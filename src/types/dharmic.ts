
export interface ScripturalQuote {
  source: string;
  quote_type: string; // e.g., Doha, Chaupai, Shloka, Pada
  original_text: string; // Devanagari or transliterated Sanskrit/Hindi
  translation: string;
  interpretation: string;
}

export interface MythologicalArchetype {
  source: string; // e.g., Mahabharata, Ramayana
  summary: string; // Concise 2-paragraph summary
}

export interface PhilosophicalGuidance {
  core_concept: string; // e.g., Karma Yoga, Vairagya, Bhakti
  explanation: string; // Practical explanation for the modern dilemma
}

export interface Pattern {
  pattern_id: string; // e.g., "karmic_archetype_id"
  pattern_name: string; // Short and evocative title
  keywords_and_themes?: string[]; // Keywords describing the conflict or dilemma - Optional for dynamic patterns
  modern_context: string; // 2-3 sentence description of the modern pattern
  mythological_archetype?: MythologicalArchetype; // Optional for dynamic patterns
  philosophical_guidance?: PhilosophicalGuidance; // Optional for dynamic patterns
  dharmic_guidance: string[]; // Actionable steps or reflective questions. For dynamic patterns, this might be empty, with all guidance in 'enhancedGuidance' state.
}
