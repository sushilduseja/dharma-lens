
'use client';

import React, { useState, useCallback, Suspense, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Wand2, ChevronDown } from 'lucide-react';
import type { Pattern, MythologicalArchetype, PhilosophicalGuidance } from '@/types/dharmic';
import { findBestMatch } from '@/lib/patternMatcher';
import { getDynamicGuidance } from '@/app/actions'; // Removed getPersonalizedInsight, getEnhancedGuidance
import type { GenerateDynamicGuidanceOutput, GenerateDynamicGuidanceInput } from '@/ai/flows/generate-dynamic-guidance';
import patternsImport from '@/data/patterns.json'; 

import { SituationCanvas } from '@/components/SituationCanvas';
import { GuidanceDisplay } from '@/components/GuidanceDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const CosmicBackground = dynamic(() => 
  import('@/components/CosmicBackground').then(mod => mod.CosmicBackground), 
  { ssr: false, loading: () => <div className="fixed inset-0 bg-background -z-10" /> }
);


export interface ShlokaDetails {
  sanskrit: string;
  english: string;
  hindi: string;
}

const allPatternsStatic: Pattern[] = patternsImport?.patterns || [];

const AppHeaderContent = React.memo(() => (
  <>
    <h1 className="page-title-hero">
      Divya Drishti
    </h1>
    <p className="page-subtitle-hero text-base sm:text-lg md:text-xl">
      Find clarity through timeless wisdom.
    </p>
  </>
));
AppHeaderContent.displayName = 'AppHeaderContent';

const AppFooter = React.memo(() => (
   <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border/50">
      <p>&copy; {new Date().getFullYear()} Divya Drishti. Insights for guidance and reflection.</p>
    </footer>
));
AppFooter.displayName = 'AppFooter';

export default function DharmalensPage() {
  const [userSituation, setUserSituation] = useState<string>('');
  const [currentMatch, setCurrentMatch] = useState<Pattern | null>(null);
  // personalizedInsight is now part of currentMatch.modern_context
  const [enhancedGuidance, setEnhancedGuidance] = useState<string[] | null>(null);
  const [shlokaDetails, setShlokaDetails] = useState<ShlokaDetails | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showGuidance, setShowGuidance] = useState<boolean>(false);
  const [isDynamicPatternFlag, setIsDynamicPatternFlag] = useState<boolean>(false); // Renamed
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const guidanceSectionRef = useRef<HTMLElement>(null);


  useEffect(() => {
    if (showGuidance) {
      if (guidanceSectionRef.current) {
         const rect = guidanceSectionRef.current.getBoundingClientRect();
         if (rect.top > window.innerHeight || rect.bottom < 0) {
            setShowScrollButton(true);
         } else {
            setShowScrollButton(false);
         }
      }
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setShowScrollButton(!entry.isIntersecting);
        },
        { root: null, rootMargin: '0px', threshold: 0.1 } 
      );

      const currentGuidanceSection = guidanceSectionRef.current;
      if (currentGuidanceSection) {
        observer.observe(currentGuidanceSection);
      }

      return () => {
        if (currentGuidanceSection) {
          observer.unobserve(currentGuidanceSection);
        }
      };
    } else {
      setShowScrollButton(false);
    }
  }, [showGuidance]);


  const resetState = useCallback(() => {
    setUserSituation('');
    setCurrentMatch(null);
    setEnhancedGuidance(null);
    setShlokaDetails(null);
    setError(null);
    setShowGuidance(false);
    setIsProcessingAI(false);
    setIsDynamicPatternFlag(false);
    setShowScrollButton(false);
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
    setEnhancedGuidance(null);
    setShlokaDetails(null);
    setIsDynamicPatternFlag(false);
    
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
    let dynamicGuidanceResult: GenerateDynamicGuidanceOutput;

    try {
      const guidanceInput: GenerateDynamicGuidanceInput = {
        userSituation,
        targetLanguage: 'en', // Defaulting to 'en' for the non-localized page
        matchedPatternName: bestMatch?.pattern_name,
        matchedPatternMythologicalSummary: bestMatch?.mythological_archetype?.summary,
        matchedPatternPhilosophicalConcept: bestMatch?.philosophical_guidance?.core_concept,
        matchedPatternInitialGuidance: bestMatch?.dharmic_guidance,
      };

      if (bestMatch) {
        setIsDynamicPatternFlag(false);
         toast({
          title: "Guidance Revealed!",
          description: `Pattern: ${bestMatch.pattern_name}`,
        });
      } else { 
        setIsDynamicPatternFlag(true);
        toast({
          title: "Seeking Deeper Wisdom...",
          description: "Crafting personalized guidance for your unique situation.",
        });
      }
      
      dynamicGuidanceResult = await getDynamicGuidance(guidanceInput);
      
      const displayPattern: Pattern = {
        pattern_id: bestMatch ? bestMatch.pattern_id : `dynamic-${Date.now()}`,
        pattern_name: dynamicGuidanceResult.generated_pattern_name,
        modern_context: dynamicGuidanceResult.generated_modern_context_and_insight,
        mythological_archetype: {
          source: bestMatch?.mythological_archetype?.source,
          summary: dynamicGuidanceResult.generated_mythological_summary,
        } as MythologicalArchetype,
        philosophical_guidance: {
          core_concept: bestMatch?.philosophical_guidance?.core_concept,
          explanation: dynamicGuidanceResult.generated_philosophical_explanation,
        } as PhilosophicalGuidance,
        dharmic_guidance: bestMatch?.dharmic_guidance || [], // Static guidance, AI version in enhancedGuidance
      };
      
      setCurrentMatch(displayPattern);
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

      if(!bestMatch) { // Only show this toast if it was a dynamic generation from the start
        toast({
          title: "Personalized Guidance Unveiled!",
          description: `Insight: ${dynamicGuidanceResult.generated_pattern_name}`,
        });
      }
      setShowGuidance(true);

    } catch (e: any) {
      console.error("AI processing error in DharmalensPage:", e.message, e.stack, e.cause);
      const originalErrorMessage = e.message || 'An unexpected error occurred during AI processing.';
      const finalErrorMessage = `An error occurred: ${originalErrorMessage}${e.stack ? `\nStack: ${e.stack}` : ''}`;
      setError(finalErrorMessage);
      toast({
        title: "Guidance Generation Failed",
        description: originalErrorMessage + " Please try rephrasing or try again later.",
        variant: "destructive",
      });
       setShowGuidance(false);
    } finally {
      setIsProcessingAI(false);
    }
  }, [userSituation, toast]);

  const handleScrollToGuidance = () => {
    guidanceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="fixed inset-0 bg-background z-0" />}>
        <CosmicBackground />
      </Suspense>
      
      <header className="hero-section-bg hero-section-shimmer py-12 md:py-16 lg:py-20 text-center relative z-10 flex flex-col items-center justify-center flex-shrink-0">
        <div className="container mx-auto px-4">
          <AppHeaderContent />
          <div className="mt-8 md:mt-10 max-w-2xl w-full mx-auto">
            <p className="text-sm text-center text-muted-foreground mb-3">
              Describe your situation or choose a theme to begin.
            </p>
            <SituationCanvas
              userSituation={userSituation}
              setUserSituation={setUserSituation}
              onSubmit={handleSubmit}
              isLoading={isProcessingAI}
            />
          </div>
        </div>
      </header>

      {showScrollButton && !isProcessingAI && showGuidance && ( 
        <button
          onClick={handleScrollToGuidance}
          className={cn(
            "scroll-down-indicator",
            { 'hidden-by-scroll': !showScrollButton }
          )}
          aria-label="View Your Guidance"
        >
          <ChevronDown />
          <span className="ml-2 text-xs">View Your Guidance</span>
        </button>
      )}

      <main id="guidance-section" ref={guidanceSectionRef} className="flex-grow flex flex-col items-center w-full relative z-0 py-6 md:py-8">
        <div className="container mx-auto px-4 w-full max-w-3xl">
          {error && !isProcessingAI && (
            <Alert variant="destructive" className="mb-6 w-full animate-fade-in-up bg-destructive/10 border-destructive/30 shadow-lg">
              <Sparkles className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-lg text-destructive font-semibold">Guidance System Hiccup</AlertTitle>
              <AlertDescription className="text-base text-destructive/90 whitespace-pre-wrap space-y-1 mt-1">
                {error.includes("[GoogleGenerativeAI Error]") || error.includes("Failed to generate") ? (
                  <>
                    <p>Our cosmic guide is currently in deep meditation. This is a moment to practice patience.</p>
                    <p className="text-sm">Take three deep breaths and try again in a few moments. Sometimes the wisest path reveals itself after a brief pause. 🕉️</p>
                  </>
                ) : (
                  <>
                    <p>A temporary disturbance in the cosmic flow has occurred.</p>
                    <p className="text-sm">Let's approach this challenge with mindful awareness. Please try your query again. 🌟</p>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {isProcessingAI && (
               <div className="flex flex-col items-center justify-center mt-8 animate-fade-in-up text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-md text-muted-foreground">Unveiling Your Path...</p>
                  <p className="text-sm text-muted-foreground/80">Seeking wisdom from the ancient scrolls.</p>
              </div>
          )}

          {showGuidance && !isProcessingAI && currentMatch && enhancedGuidance && (
            <div className="w-full animate-fade-in-up animation-delay-200">
              <GuidanceDisplay
                pattern={currentMatch}
                // personalizedInsight is now part of currentMatch.modern_context
                enhancedGuidance={enhancedGuidance}
                shlokaDetails={shlokaDetails}
                onReset={resetState}
                isDynamicPattern={isDynamicPatternFlag}
              />
            </div>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
