'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react'; 
import type { Pattern } from '@/types/dharmic';
import { findBestMatch } from '@/lib/patternMatcher';
import { getPersonalizedInsight, getEnhancedGuidance, getPatternsServerSide, getDynamicGuidance } from '@/app/actions';
import type { EnhanceDharmicGuidanceOutput, EnhanceDharmicGuidanceInput } from '@/ai/flows/enhance-dharmic-guidance';
import type { GenerateDynamicGuidanceOutput } from '@/ai/flows/generate-dynamic-guidance';
import type { Locale } from '@/i18n/config';
import { useTranslations } from '@/hooks/use-translations';

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

interface AppHeaderProps {
  t: (key: string) => string;
}

const AppHeader = React.memo(({ t }: AppHeaderProps) => (
  <header className="w-full py-4 px-4 md:px-6 backdrop-blur-lg bg-background/50 shadow-header sticky top-0 z-20">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('guidance.header.title')}
        </h1>
      </div>
    </div>
  </header>
));

export interface DharmalensClientProps {
  lang: Locale;
  messages: Record<string, any>;
}

export default function DharmalensClient({ lang, messages }: DharmalensClientProps) {
  const { t } = useTranslations(lang, messages);
  const [situation, setSituation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guidance, setGuidance] = useState<any>(null); // State to hold guidance output

  useEffect(() => {
    document.title = t('guidance.header.title');
  }, [t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGuidance(null); // Clear previous guidance
    try {
      // Call your server action here to get guidance
      // const result = await yourServerAction(situation);
      // setGuidance(result);
      // Placeholder for now:
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      setGuidance({ insight: 'Sample Insight', dharmic: 'Sample Dharmic Guidance' });
    } catch (error) {
      console.error('Error submitting situation:', error);
      // Handle error, maybe show a toast
    } finally {
      setIsSubmitting(false);
    }
  }, [situation]); // Add situation to dependency array

  return (
    <>
      <AppHeader t={t} />
      <div className="relative min-h-screen">
        <CosmicBackground />
        <div className="container mx-auto px-4 py-8">
          <SituationCanvas
            t={t}
            situation={situation}
            setSituation={setSituation}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
          <GuidanceDisplay t={t} guidance={guidance} />
        </div>
      </div>
    </>
  );
}
