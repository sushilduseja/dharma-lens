'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react'; 
import type { Pattern } from '@/types/dharmic';
import { findBestMatch } from '@/lib/patternMatcher';
import { getPersonalizedInsight, getEnhancedGuidance, getPatternsServerSide, getDynamicGuidance } from '@/app/actions';
import type { EnhanceDharmicGuidanceOutput, EnhanceDharmicGuidanceInput } from '@/ai/flows/enhance-dharmic-guidance';
import type { GenerateDynamicGuidanceOutput } from '@/ai/flows/generate-dynamic-guidance';


import { SituationCanvas } from '@/components/SituationCanvas';
import { GuidanceDisplay } from '@/components/GuidanceDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CosmicBackground } from '@/components/CosmicBackground';


export interface ShlokaDetails {
  sanskrit: string;
  english: string;
  hindi: string;
  punjabi?: string;
  bhojpuri?: string;
}

const AppHeader = React.memo(() => (
  <header className="py-6 md:py-10 text-center relative z-10 bg-transparent mb-0">
    <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight
                   text-primary-foreground 
                   bg-gradient-to-r from-primary via-accent to-primary 
                   animate-shimmer bg-[length:200%_auto] 
                   drop-shadow-[0_3px_4px_hsl(var(--primary)/0.3)]
                   px-6 py-3 rounded-lg">
      Divya Drishti
    </h1>
    <p className="text-foreground/80 mt-3 text-base sm:text-lg md:text-xl filter drop-shadow-[0_1px_2px_hsl(var(--primary)/0.1)]">
      Find clarity through timeless wisdom.
    </p>
  </header>
));
AppHeader.displayName = 'AppHeader';

const AppFooter = React.memo(() => (
   <footer className="py-6 md:py-8 mt-auto text-center text-sm text-muted-foreground relative z-10 border-t border-border/50">
      <p>&copy; {new Date().getFullYear()} Divya Drishti. Insights for guidance and reflection.</p>
    </footer>
));
AppFooter.displayName = 'AppFooter';

export default function DharmalensPage() {
  const [patternsData, setPatternsData] = useState<Pattern[]>([]);
  const [userSituation, setUserSituation] = useState<string>('');
  const [currentMatch, setCurrentMatch] = useState<Pattern | null>(null);
  const [personalizedInsight, setPersonalizedInsight] = useState<string | null>(null);
  const [enhancedGuidance, setEnhancedGuidance] = useState<string[] | null>(null);
  const [shlokaDetails, setShlokaDetails] = useState<ShlokaDetails | null>(null);
  const [isLoadingPatterns, setIsLoadingPatterns] = useState<boolean>(true);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showGuidance, setShowGuidance] = useState<boolean>(false);

  useEffect(() => {
    async function loadPatterns() {
      setIsLoadingPatterns(true);
      setError(null);
      try {
        const data = await getPatternsServerSide();
        if (data.length === 0) {
          console.warn("Guiding patterns data is empty. Dynamic guidance will be relied upon more heavily.");
        }
        setPatternsData(data);
      } catch (e: any) {
        setError(`An error occurred while loading patterns: ${e.message || 'Unknown error'}`);
         toast({
            title: "Loading Error",
            description: e.message || "An unexpected error occurred while trying to load patterns.",
            variant: "destructive",
          });
      } finally {
        setIsLoadingPatterns(false);
      }
    }
    loadPatterns();
  }, [toast]);

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

    if (patternsData.length === 0 && isLoadingPatterns) { 
      toast({
        title: "Patterns Still Loading",
        description: "Wisdom is gathering, please wait a moment.",
      });
      setIsProcessingAI(false);
      return;
    }
    
    const bestMatch = findBestMatch(userSituation, patternsData);

    try {
      await new Promise(resolve => setTimeout(resolve, 200)); 

      if (bestMatch) {
        setCurrentMatch(bestMatch);
        const guidanceInput: EnhanceDharmicGuidanceInput = {
          situationDescription: userSituation,
          patternIdentified: bestMatch.pattern_name,
          mythologicalSummary: bestMatch.mythological_archetype?.summary || "A relevant ancient story.", 
          currentGuidance: bestMatch.dharmic_guidance,
        };
        
        const [insightResult, guidanceResult] = await Promise.all([
          getPersonalizedInsight({
            situation: userSituation,
            mythologicalSummary: bestMatch.mythological_archetype?.summary || "A relevant ancient story.",
            insightTemplate: bestMatch.modern_context, 
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
        const dynamicGuidanceResult: GenerateDynamicGuidanceOutput = await getDynamicGuidance({ userSituation });
        
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
      console.error("AI processing error:", e);
      const errorMessage = e.message || 'An unexpected error occurred while generating guidance.';
      setError(`An error occurred: ${errorMessage}`);
      toast({
        title: "Guidance Generation Failed",
        description: errorMessage + " Please try rephrasing or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAI(false);
    }
  }, [userSituation, patternsData, toast, isLoadingPatterns]);


  if (isLoadingPatterns && patternsData.length === 0 && !error) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <CosmicBackground />
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-6 text-xl text-muted-foreground tracking-wide">Gathering Ancient Wisdom...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative isolate"> 
      <CosmicBackground />
      <AppHeader />
      <main className="container mx-auto px-4 pt-2 pb-4 md:pt-2 md:pb-6 flex-grow relative z-10 flex flex-col items-center w-full">
        {error && !isProcessingAI && ( 
          <Alert variant="destructive" className="mb-6 max-w-2xl w-full animate-fade-in-up bg-destructive/95 text-destructive-foreground shadow-lg">
            <Sparkles className="h-5 w-5" />
            <AlertTitle className="text-lg">Encountered an Obstacle</AlertTitle>
            <AlertDescription className="text-base">{error}</AlertDescription>
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
