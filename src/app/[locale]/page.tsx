
'use client';

import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Pattern } from '@/types/dharmic';
import { findBestMatch } from '@/lib/patternMatcher';
import { getPersonalizedInsight, getEnhancedGuidance, getDynamicGuidance } from '@/app/actions';
import type { EnhanceDharmicGuidanceOutput, EnhanceDharmicGuidanceInput } from '@/ai/flows/enhance-dharmic-guidance';
import type { GenerateDynamicGuidanceOutput } from '@/ai/flows/generate-dynamic-guidance';
import patternsImport from '@/data/patterns.json'; // Import patterns directly

import { SituationCanvas } from '@/components/SituationCanvas';
import { GuidanceDisplay } from '@/components/GuidanceDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CosmicBackground } from '@/components/CosmicBackground';
import { AppHeader, AppFooter } from '@/components/AppChrome'; // Assuming AppHeader/Footer are in AppChrome

// Make allPatternsStatic initialization more robust
const allPatternsStatic: Pattern[] = patternsImport?.patterns || [];

export interface ShlokaDetails {
  sanskrit: string;
  english: string;
  hindi: string;
}

export default function DharmalensPage() {
  const t = useTranslations('DharmalensPage');
  const locale = useLocale();
  const { toast } = useToast();

  const [userSituation, setUserSituation] = useState<string>('');
  const [currentMatch, setCurrentMatch] = useState<Pattern | null>(null);
  const [personalizedInsight, setPersonalizedInsight] = useState<string | null>(null);
  const [enhancedGuidance, setEnhancedGuidance] = useState<string[] | null>(null);
  const [shlokaDetails, setShlokaDetails] = useState<ShlokaDetails | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(t('errorInputRequiredDescription'));
      toast({ title: t('toastInputRequiredTitle'), description: t('toastInputRequiredDescription'), variant: "destructive" });
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
      const errorMsg = t('errorPatternsNotLoaded', { filePath: 'src/data/patterns.json' });
      setError(errorMsg);
      toast({
        title: t('toastPatternsErrorTitle'),
        description: errorMsg,
        variant: "destructive",
      });
      setIsProcessingAI(false);
      return;
    }

    const bestMatchRaw = findBestMatch(userSituation, allPatternsStatic);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      if (bestMatchRaw) {
        let finalPatternName = bestMatchRaw.pattern_name;
        let finalModernContext = bestMatchRaw.modern_context;
        let finalMythologicalSummary = bestMatchRaw.mythological_archetype?.summary || t('defaultMythologicalSummary');
        let finalPhilosophicalExplanation = bestMatchRaw.philosophical_guidance?.explanation || '';
        let finalDharmicGuidance = bestMatchRaw.dharmic_guidance || [];

        if (locale !== 'en' && bestMatchRaw.translations && (bestMatchRaw.translations as any)[locale]) {
          const localeTranslations = (bestMatchRaw.translations as any)[locale];
          finalPatternName = localeTranslations.pattern_name || finalPatternName;
          finalModernContext = localeTranslations.modern_context || finalModernContext;
          finalMythologicalSummary = localeTranslations.mythological_archetype_summary || finalMythologicalSummary;
          finalPhilosophicalExplanation = localeTranslations.philosophical_guidance_explanation || finalPhilosophicalExplanation;
          finalDharmicGuidance = localeTranslations.dharmic_guidance || finalDharmicGuidance;
        }

        const bestMatchForDisplay: Pattern = {
          ...bestMatchRaw,
          pattern_name: finalPatternName,
          modern_context: finalModernContext,
          dharmic_guidance: finalDharmicGuidance,
          mythological_archetype: bestMatchRaw.mythological_archetype ? {
            ...bestMatchRaw.mythological_archetype,
            summary: finalMythologicalSummary
          } : undefined,
          philosophical_guidance: bestMatchRaw.philosophical_guidance ? {
            ...bestMatchRaw.philosophical_guidance,
            explanation: finalPhilosophicalExplanation
          } : undefined,
        };
        setCurrentMatch(bestMatchForDisplay);

        const guidanceInput: EnhanceDharmicGuidanceInput = {
          situationDescription: userSituation,
          patternIdentified: finalPatternName,
          mythologicalSummary: finalMythologicalSummary,
          currentGuidance: finalDharmicGuidance,
          targetLanguage: locale,
        };

        const [insightResult, guidanceResult] = await Promise.all([
          getPersonalizedInsight({
            situation: userSituation,
            mythologicalSummary: finalMythologicalSummary,
            insightTemplate: finalModernContext,
            targetLanguage: locale,
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
          title: t('toastGuidanceRevealedTitle'),
          description: `${t('toastGuidanceRevealedPatternLabel')}: ${finalPatternName}`,
        });

      } else {
        toast({
          title: t('toastDeeperWisdomTitle'),
          description: t('toastDeeperWisdomDescription'),
        });
        const dynamicGuidanceResult: GenerateDynamicGuidanceOutput = await getDynamicGuidance({
          userSituation,
          targetLanguage: locale
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
          title: t('toastPersonalizedGuidanceTitle'),
          description: `${t('toastPersonalizedGuidanceInsightLabel')}: ${dynamicGuidanceResult.generated_pattern_name}`,
        });
      }
      setShowGuidance(true);

    } catch (e: any) {
      console.error("AI processing error:", e);
      const originalErrorMessage = e.message || t('errorAIProcessingFailed');
      const finalErrorMessage = `${t('errorOccurred')}: ${originalErrorMessage}${e.stack ? `\nStack: ${e.stack}` : ''}`;
      setError(finalErrorMessage);
      toast({
        title: t('toastGuidanceFailedTitle'),
        description: originalErrorMessage + " " + t('toastGuidanceFailedSuggestion'),
        variant: "destructive",
      });
    } finally {
      setIsProcessingAI(false);
    }
  }, [userSituation, toast, locale, t]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative isolate">
      <CosmicBackground />
      <AppHeader />
      <main className="container mx-auto px-4 pt-2 pb-4 md:pt-2 md:pb-6 flex-grow relative z-10 flex flex-col items-center w-full">
        {error && !isProcessingAI && (
          <Alert variant="destructive" className="mb-6 max-w-2xl w-full animate-fade-in-up bg-destructive/95 text-destructive-foreground shadow-lg">
            <Sparkles className="h-5 w-5" />
            <AlertTitle className="text-lg">{t('alertErrorTitle')}</AlertTitle>
            <AlertDescription className="text-base whitespace-pre-wrap">{error}</AlertDescription>
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
                <p className="mt-4 text-lg text-muted-foreground">{t('loadingAI')}</p>
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
