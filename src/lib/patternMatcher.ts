
import type { Pattern } from '@/types/dharmic';

// fetchPatterns is no longer needed here as data is fetched server-side

export function findBestMatch(userInput: string, patterns: Pattern[]): Pattern | null {
  if (!userInput || patterns.length === 0) {
    return null;
  }

  const processedInput = userInput.toLowerCase().split(/\s+/); // Split into words
  let bestMatch: Pattern | null = null;
  let highestScore = 0;

  patterns.forEach(pattern => {
    let currentScore = 0;
    // Ensure keywords_and_themes exists and is an array before calling forEach
    if (Array.isArray(pattern.keywords_and_themes)) {
      pattern.keywords_and_themes.forEach(keyword => {
        // Check if keyword (which can be multi-word) is present in user input
        // This is a simple check; more sophisticated matching could be used
        if (userInput.toLowerCase().includes(keyword.toLowerCase())) {
          currentScore++;
        }
      });
    }


    if (currentScore > highestScore) {
      highestScore = currentScore;
      bestMatch = pattern;
    }
  });
  
  // If no keywords matched at all, but we want to provide some default or handle it.
  // For now, if highestScore is 0, bestMatch will be null.
  // We could add a small bonus for patterns that have at least one match to prefer them over no match.
  if (highestScore === 0) return null;


  return bestMatch;
}
