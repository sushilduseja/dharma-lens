
'use client';

import React, { useState, useCallback, Suspense, useRef, useEffect } from 'react';
import { Sparkles, Loader2, ChevronDown } from 'lucide-react'; 
import type { Pattern, MythologicalArchetype, PhilosophicalGuidance } from '@/types/dharmic';
import { findBestMatch } from '@/lib/patternMatcher';
import { getDynamicGuidance } from '@/app/actions'; // Removed getPersonalizedInsight, getEnhancedGuidance
import type { GenerateDynamicGuidanceOutput, GenerateDynamicGuidanceInput } from '@/ai/flows/generate-dynamic-guidance';
import patternsImport from '@/data/patterns.json'; 

import { SituationCanvas } from '@/components/SituationCanvas';
import { GuidanceDisplay } from '@/components/GuidanceDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLocale, useTranslations } from 'next-intl';
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

const AppHeaderContent = React.memo(() => {
  const t = useTranslations('AppHeader');
  return (
    <>
      <h1 className="page-title-hero">
        {t('title')}
      </h1>
      <p className="page-subtitle-hero text-base sm:text-lg md:text-xl">
        {t('subtitle1')}
      </p>
    </>
  );
});
AppHeaderContent.displayName = 'AppHeaderContent';

const AppFooter = React.memo(() => {
  const t = useTranslations('AppFooter');
  return (
    <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border/50">
      <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
    </footer>
  );
});
AppFooter.displayName = 'AppFooter';

export default function DharmalensPage() {
  const locale = useLocale();
  const tAppHeader = useTranslations('AppHeader');
  const tPage = useTranslations('DharmalensPage');
  const tToast = useTranslations('ToastMessages');
  const tScrollIndicator = useTranslations('ScrollIndicator');

  const [userSituation, setUserSituation] = useState<string>('');
  const [currentMatch, setCurrentMatch] = useState<Pattern | null>(null);
  // personalizedInsight is now part of currentMatch.modern_context
  const [enhancedGuidance, setEnhancedGuidance] = useState<string[] | null>(null);
  const [shlokaDetails, setShlokaDetails] = useState<ShlokaDetails | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showGuidance, setShowGuidance] = useState<boolean>(false);
  const [isDynamicPatternFlag, setIsDynamicPatternFlag] = useState<boolean>(false); // Renamed to avoid conflict
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
      setError(tPage('errorInputRequired'));
      toast({ title: tToast('titleInputRequired'), description: tToast('descInputRequired'), variant: "destructive" });
      return;
    }
    setIsProcessingAI(true);
    setError(null);
    setCurrentMatch(null);
    setEnhancedGuidance(null);
    setShlokaDetails(null);
    setIsDynamicPatternFlag(false);

    if (!allPatternsStatic || allPatternsStatic.length === 0) {
      const errorMsg = tPage('errorPatternsNotLoaded', { filePath: 'src/data/patterns.json'});
      setError(errorMsg);
      toast({
        title: tToast('titlePatternsError'),
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
        targetLanguage: locale,
        matchedPatternName: bestMatch?.pattern_name,
        // Ensure translations are used if available for matched pattern context
        matchedPatternMythologicalSummary: bestMatch?.translations?.[locale]?.mythological_summary || bestMatch?.mythological_archetype?.summary,
        matchedPatternPhilosophicalConcept: bestMatch?.translations?.[locale]?.philosophical_concept || bestMatch?.philosophical_guidance?.core_concept,
        matchedPatternInitialGuidance: bestMatch?.translations?.[locale]?.dharmic_guidance || bestMatch?.dharmic_guidance,
      };

      if (bestMatch) {
        setIsDynamicPatternFlag(false);
        toast({
          title: tToast('titleGuidanceRevealed'),
          description: tToast('descPatternMatched', { patternName: bestMatch.translations?.[locale]?.pattern_name || bestMatch.pattern_name }),
        });
      } else {
        setIsDynamicPatternFlag(true);
        toast({
          title: tToast('titleSeekingDeeperWisdom'),
          description: tToast('descCraftingPersonalizedGuidance'),
        });
      }
      
      dynamicGuidanceResult = await getDynamicGuidance(guidanceInput);

      const displayPattern: Pattern = {
        pattern_id: bestMatch ? bestMatch.pattern_id : `dynamic-${Date.now()}`,
        pattern_name: dynamicGuidanceResult.generated_pattern_name,
        modern_context: dynamicGuidanceResult.generated_modern_context_and_insight,
        mythological_archetype: {
          source: bestMatch?.mythological_archetype?.source, // Source can be optional
          summary: dynamicGuidanceResult.generated_mythological_summary,
        } as MythologicalArchetype, // Cast to ensure type correctness
        philosophical_guidance: {
          core_concept: bestMatch?.philosophical_guidance?.core_concept, // Concept can be optional
          explanation: dynamicGuidanceResult.generated_philosophical_explanation,
        } as PhilosophicalGuidance, // Cast to ensure type correctness
        dharmic_guidance: bestMatch?.dharmic_guidance || [], // Static guidance, AI version in enhancedGuidance
        translations: bestMatch?.translations, // Preserve original translations if any
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
      
      // Toast after AI processing is complete
      if(bestMatch) {
         // Already toasted above
      } else {
        toast({
          title: tToast('titlePersonalizedGuidanceUnveiled'),
          description: tToast('descInsightGenerated', { insightName: dynamicGuidanceResult.generated_pattern_name }),
        });
      }
      setShowGuidance(true);

    } catch (e: any) {
      console.error("AI processing error in DharmalensPage:", e.message, e.stack, e.cause);
      const originalErrorMessage = e.message || tPage('errorUnexpectedAI');
      const finalErrorMessage = tPage('errorOccurredWithDetails', { errorMessage: originalErrorMessage, stack: e.stack ? `\nStack: ${e.stack}` : '' });
      setError(finalErrorMessage);
      toast({
        title: tToast('titleGuidanceFailed'),
        description: tToast('descGuidanceFailed', { error: originalErrorMessage }),
        variant: "destructive",
      });
      setShowGuidance(false); 
    } finally {
      setIsProcessingAI(false);
    }
  }, [userSituation, toast, locale, tPage, tToast]);

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
              {tAppHeader('subtitle2')}
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
          aria-label={tScrollIndicator('label')}
        >
          <ChevronDown />
          <span className="ml-2 text-xs">{tScrollIndicator('text', { default: "View Your Guidance"})}</span>
        </button>
      )}

      <main id="guidance-section" ref={guidanceSectionRef} className="flex-grow flex flex-col items-center w-full relative z-0 py-6 md:py-8">
        <div className="container mx-auto px-4 w-full max-w-3xl">
          {error && !isProcessingAI && (
            <Alert variant="destructive" className="mb-6 w-full animate-fade-in-up bg-destructive/10 border-destructive/30 shadow-lg">
              <Sparkles className="h-5 w-5 text-destructive" />
              <AlertTitle className="text-lg text-destructive font-semibold">{tPage('errorAlertTitle')}</AlertTitle>
              <AlertDescription className="text-base text-destructive/90 whitespace-pre-wrap space-y-1 mt-1">
                {error.includes("[GoogleGenerativeAI Error]") || error.includes("Failed to generate") ? (
                  <>
                    <p>{tPage('errorAIGuideMeditating')}</p>
                    <p className="text-sm">{tPage('errorAIGuidePatience')}</p>
                  </>
                ) : (
                  <>
                    <p>{tPage('errorCosmicFlowDisturbance')}</p>
                    <p className="text-sm">{tPage('errorCosmicFlowRetry')}</p>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {isProcessingAI && (
              <div className="flex flex-col items-center justify-center mt-8 animate-fade-in-up text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-md text-muted-foreground">{tPage('loadingUnveilingPath')}</p>
                  <p className="text-sm text-muted-foreground/80">{tPage('loadingSeekingWisdom')}</p>
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
