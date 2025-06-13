'use client';

import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Pattern } from '@/types/dharmic';
import { findBestMatch } from '@/lib/patternMatcher';
import { getPersonalizedInsight, getEnhancedGuidance, getDynamicGuidance } from '@/app/actions';
import type { EnhanceDharmicGuidanceOutput, EnhanceDharmicGuidanceInput } from '@/ai/flows/enhance-dharmic-guidance';
import type { GenerateDynamicGuidanceOutput } from '@/ai/flows/generate-dynamic-guidance';
import patternsImport from '@/data/patterns.json';

import { SituationCanvas } from '@/components/SituationCanvas';
import { GuidanceDisplay } from '@/components/GuidanceDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CosmicBackground } from '@/components/CosmicBackground';

export interface ShlokaDetails {
  sanskrit: string;
  english: string;
  hindi: string;
}

// Make allPatternsStatic initialization more robust
const allPatternsStatic: Pattern[] = patternsImport?.patterns || [];

const AppHeader = React.memo(() => (
  <header className="py-6 md:py-10 text-center relative z-10 bg-transparent mb-0">
    <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight
                   bg-gradient-to-r from-[#ff10f0] via-[#2d00f7] to-[#00ff9d]
                   animate-shimmer bg-[length:200%_auto] bg-clip-text text-transparent
                   drop-shadow-[0_2px_20px_rgba(255,16,240,0.3)]
                   px-6 py-3">
      Divya Drishti
    </h1>
    <p className="text-[#00ff9d]/90 mt-3 text-base sm:text-lg md:text-xl 
                  filter drop-shadow-[0_2px_8px_rgba(0,255,157,0.2)]
                  font-medium">
      Find clarity through timeless wisdom.
    </p>
  </header>
));
AppHeader.displayName = 'AppHeader';

const AppFooter = React.memo(() => (
   <footer className="py-6 md:py-8 mt-auto text-center text-sm text-[#00ff9d]/70 relative z-10 border-t border-[#ff10f0]/10">
      <p>&copy; {new Date().getFullYear()} Divya Drishti. Insights for guidance and reflection.</p>
    </footer>
));
AppFooter.displayName = 'AppFooter';

export default function DharmalensPage() {
  const [userSituation, setUserSituation] = useState<string>('');
  const [currentMatch, setCurrentMatch] = useState<Pattern | null>(null);
  const [personalizedInsight, setPersonalizedInsight] = useState<string | null>(null);
  const [enhancedGuidance, setEnhancedGuidance] = useState<string[] | null>(null);
  const [shlokaDetails, setShlokaDetails] = useState<ShlokaDetails | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showGuidance, setShowGuidance] = useState<boolean>(false);

  const resetState = useCallback(() => {
    setUserSituation('');
    setCurrentMatch(null);
    setPersonalizedInsight(null);
    setEnhancedGuidance(null);
    setShlokaDetails(null);
    setError(null);
    setShowGuidance(false);
    setIsProcessingAI(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!userSituation.trim()) {
      setError("Please describe your situation before proceeding.");
      toast({ title: "Input Required", description: "Please describe your situation.", variant: "destructive" });
      return;
    }
    setIsProcessingAI(true);
    setError(null);
    setCurrentMatch(null);
    setPersonalizedInsight(null);
    setEnhancedGuidance(null);
    setShlokaDetails(null);
    setShowGuidance(false);

    if (!allPatternsStatic || allPatternsStatic.length === 0) {
      const errorMsg = "Error: Imported patterns data is empty or invalid. Please check src/data/patterns.json.";
      setError(errorMsg);
      toast({
        title: "Patterns Data Error",
        description: errorMsg,
        variant: "destructive",
      });
      setIsProcessingAI(false);
      return;
    }

    const bestMatch = findBestMatch(userSituation, allPatternsStatic);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      if (bestMatch) {
        setCurrentMatch(bestMatch);
        const guidanceInput: EnhanceDharmicGuidanceInput = {
          situationDescription: userSituation,
          patternIdentified: bestMatch.pattern_name,
          mythologicalSummary: bestMatch.mythological_archetype?.summary || "A relevant ancient story.",
          currentGuidance: bestMatch.dharmic_guidance,
          targetLanguage: 'en',
        };

        const [insightResult, guidanceResult] = await Promise.all([
          getPersonalizedInsight({
            situation: userSituation,
            mythologicalSummary: bestMatch.mythological_archetype?.summary || "A relevant ancient story.",
            insightTemplate: bestMatch.modern_context,
            targetLanguage: 'en',
          }),
          getEnhancedGuidance(guidanceInput) as Promise<EnhanceDharmicGuidanceOutput>
        ]);

        setPersonalizedInsight(insightResult.personalizedInsight);
        setEnhancedGuidance(guidanceResult.enhancedGuidance);

        if (guidanceResult.sanskritShloka || guidanceResult.shlokaEnglishTranslation || guidanceResult.shlokaHindiTranslation) {
          setShlokaDetails({
            sanskrit: guidanceResult.sanskritShloka || '',
            english: guidanceResult.shlokaEnglishTranslation || '',
            hindi: guidanceResult.shlokaHindiTranslation || '',
          });
        } else {
          setShlokaDetails(null);
        }
        toast({
          title: "Guidance Revealed!",
          description: `Pattern: ${bestMatch.pattern_name}`,
        });
      } else {
        toast({
          title: "Seeking Deeper Wisdom...",
          description: "No predefined pattern matched. Crafting personalized guidance for your unique situation.",
        });
        const dynamicGuidanceResult: GenerateDynamicGuidanceOutput = await getDynamicGuidance({
          userSituation,
          targetLanguage: 'en'
        });

        const dynamicPattern: Pattern = {
          pattern_id: `dynamic-${Date.now()}`,
          pattern_name: dynamicGuidanceResult.generated_pattern_name,
          modern_context: dynamicGuidanceResult.generated_modern_context_and_insight,
          dharmic_guidance: [],
        };
        setCurrentMatch(dynamicPattern);
        setPersonalizedInsight(dynamicGuidanceResult.generated_modern_context_and_insight);
        setEnhancedGuidance(dynamicGuidanceResult.generated_dharmic_guidance);

        if (dynamicGuidanceResult.sanskritShloka || dynamicGuidanceResult.shlokaEnglishTranslation || dynamicGuidanceResult.shlokaHindiTranslation) {
          setShlokaDetails({
            sanskrit: dynamicGuidanceResult.sanskritShloka || '',
            english: dynamicGuidanceResult.shlokaEnglishTranslation || '',
            hindi: dynamicGuidanceResult.shlokaHindiTranslation || '',
          });
        } else {
          setShlokaDetails(null);
        }
        toast({
          title: "Personalized Guidance Unveiled!",
          description: `Insight: ${dynamicGuidanceResult.generated_pattern_name}`,
        });
      }
      setShowGuidance(true);

    } catch (e: any) {
      console.error("AI processing error in DharmalensPage:", e);
      const originalErrorMessage = e.message || 'An unexpected error occurred during AI processing.';
      const finalErrorMessage = `An error occurred: ${originalErrorMessage}${e.stack ? `\nStack: ${e.stack}` : ''}`;
      setError(finalErrorMessage);
      toast({
        title: "Guidance Generation Failed",
        description: originalErrorMessage + " Please try rephrasing or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAI(false);
    }
  }, [userSituation, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative isolate">
      <CosmicBackground />
      <AppHeader />
      <main className="container mx-auto px-4 pt-2 pb-4 md:pt-2 md:pb-6 flex-grow relative z-10 flex flex-col items-center w-full">
        {error && !isProcessingAI && (          <Alert className="mb-6 max-w-2xl w-full animate-fade-in-up border-primary/30 bg-card/95 backdrop-blur-sm shadow-[0_0_25px_rgba(255,16,240,0.1)]">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <AlertTitle className="text-lg bg-gradient-to-r from-[#ff10f0] to-[#00ff9d] bg-clip-text text-transparent font-semibold">Seeking Inner Balance</AlertTitle>            <AlertDescription className="text-base space-y-2">
              {error.includes("[GoogleGenerativeAI Error]") || error.includes("Failed to generate") ? (
                <>
                  <p className="text-white/90">Our cosmic guide is currently in deep meditation. This is a moment to practice patience.</p>
                  <p className="text-sm text-[#00ff9d]/90">Take three deep breaths and try again in a few moments. Sometimes the wisest path reveals itself after a brief pause. 🕉️</p>
                </>
              ) : (
                <>
                  <p className="text-white/90">A temporary disturbance in the cosmic flow has occurred.</p>
                  <p className="text-sm text-[#00ff9d]/90">Let's approach this challenge with mindful awareness. Please try your query again. 🌟</p>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <SituationCanvas
          userSituation={userSituation}
          setUserSituation={setUserSituation}
          onSubmit={handleSubmit}
          isLoading={isProcessingAI}
        />

        {isProcessingAI && (
             <div className="flex flex-col items-center justify-center mt-8 animate-fade-in-up">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Unveiling Your Path...</p>
            </div>
        )}

        {showGuidance && !isProcessingAI && currentMatch && personalizedInsight && enhancedGuidance && (
          <div className="mt-8 md:mt-12 w-full animate-fade-in-up animation-delay-200">
            <GuidanceDisplay
              pattern={currentMatch}
              personalizedInsight={personalizedInsight}
              enhancedGuidance={enhancedGuidance}
              shlokaDetails={shlokaDetails}
              onReset={resetState}
            />
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
