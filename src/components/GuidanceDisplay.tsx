
'use client';

import React from 'react';
import type { Pattern } from '@/types/dharmic';
import type { ShlokaDetails } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollText, Lightbulb, ListChecks, Sparkles, ArrowLeft, BookOpenText, BookMarked, MessageSquareQuote, Brain, UserCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidanceDisplayProps {
  pattern: Pattern;
  personalizedInsight: string;
  enhancedGuidance: string[];
  shlokaDetails: ShlokaDetails | null;
  onReset: () => void;
}

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  description?: string;
  cardClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const SectionCardComponent: React.FC<SectionCardProps> = ({ title, icon, children, description, cardClassName, titleClassName, contentClassName }) => (
  <Card className={cn(
    "shadow-card-calm transition-all duration-300 ease-out hover:shadow-card-calm-hover bg-card/90 backdrop-blur-sm border border-primary/10 hover:border-primary/20 flex flex-col group",
    cardClassName
  )}>
    <CardHeader className="p-4 md:p-5">
      <CardTitle className={cn("flex items-center text-xl md:text-2xl font-semibold text-primary tracking-tight", titleClassName)}>
        {icon && <span className="mr-3 text-accent opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">{icon}</span>}
        {title}
      </CardTitle>
      {description && <CardDescription className="mt-1.5 text-sm md:text-base text-muted-foreground italic">{description}</CardDescription>}
    </CardHeader>
    {children && (
      <CardContent className={cn("p-4 md:p-5 pt-0 text-base md:text-lg leading-relaxed text-card-foreground flex-grow", contentClassName)}>
        {children}
      </CardContent>
    )}
  </Card>
);
SectionCardComponent.displayName = 'SectionCardComponent';
const SectionCard = React.memo(SectionCardComponent);


const GuidanceDisplayComponent = ({ pattern, personalizedInsight, enhancedGuidance, shlokaDetails, onReset }: GuidanceDisplayProps) => {
  const hasModernContext = !!pattern.modern_context;
  const hasShloka = !!(shlokaDetails && (shlokaDetails.sanskrit || shlokaDetails.english || shlokaDetails.hindi));
  const hasMythologicalArchetype = !!pattern.mythological_archetype;
  const hasPhilosophicalGuidance = !!pattern.philosophical_guidance;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 md:space-y-8 p-2 sm:p-0">
      <Button variant="outline" onClick={onReset} className="mb-4 md:mb-6 group text-base py-2.5 px-5 hover:bg-primary/10 hover:border-primary/30 transition-all">
         <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Explore Another Situation
      </Button>

      <Card className={cn("text-center bg-gradient-to-br from-primary/10 via-card/80 to-card/70 backdrop-blur-md !shadow-xl !shadow-primary/10 border-primary/20", "py-4 md:py-6")}>
        <CardHeader className="p-3 md:p-4">
          <CardTitle className="flex items-center justify-center text-2xl md:text-4xl font-bold text-primary tracking-tight">
            <Sparkles size={32} className="mr-3 text-accent animate-subtle-glow-pulse" />
            {pattern.pattern_name}
          </CardTitle>
           <CardDescription className="mt-2 text-base md:text-lg text-muted-foreground">Identified Archetypal Pattern</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
         {hasMythologicalArchetype && (
            <SectionCard 
              title="Mythological Archetype" 
              icon={<BookMarked size={24} />} 
              description={pattern.mythological_archetype!.source ? `From: ${pattern.mythological_archetype!.source}` : "The ancient story embodying this pattern."}
              cardClassName="md:col-span-1"
            >
            {pattern.mythological_archetype!.source && <h4 className="font-semibold text-lg md:text-xl mb-2 text-accent">{pattern.mythological_archetype!.source}</h4>}
            <p className="leading-relaxed md:leading-loose">{pattern.mythological_archetype!.summary}</p>
            </SectionCard>
        )}

        {hasPhilosophicalGuidance && (
            <SectionCard 
              title="Philosophical Guidance" 
              icon={<MessageSquareQuote size={24}/>} 
              description={pattern.philosophical_guidance!.core_concept ? `Core Concept: ${pattern.philosophical_guidance!.core_concept}` : "The spiritual principle for this pattern."}
              cardClassName="md:col-span-1"
            >
                {pattern.philosophical_guidance!.core_concept && <h4 className="font-semibold text-lg md:text-xl mb-2 text-accent">{pattern.philosophical_guidance!.core_concept}</h4>}
                <p className="leading-relaxed md:leading-loose">{pattern.philosophical_guidance!.explanation}</p>
            </SectionCard>
        )}

        {hasModernContext && (
          <SectionCard 
            title="Understanding this Pattern Today" 
            icon={<Brain size={24} />}
            description="How this ancient pattern manifests in contemporary life."
            cardClassName={cn(
                "!bg-card/95 backdrop-blur-sm",
                hasShloka ? "md:col-span-1" : "md:col-span-2"
            )}
          >
            <p className="leading-relaxed md:leading-loose">{pattern.modern_context}</p>
          </SectionCard>
        )}

        {hasShloka && (
          <SectionCard 
            title="Sacred Verse & Translations" 
            icon={<BookOpenText size={24} />} 
            description="A specially selected verse offering deeper insight."
            cardClassName={cn(
                hasModernContext ? "md:col-span-1" : "md:col-span-2"
            )}
            contentClassName="space-y-3 md:space-y-4"
          >
            {shlokaDetails!.sanskrit && (
              <div>
                <h4 className="font-semibold text-lg md:text-xl mb-1 text-accent">Sanskrit Verse (संस्कृत श्लोक):</h4>
                <p className="text-xl md:text-2xl font-devanagari text-foreground/90" lang={shlokaDetails!.sanskrit.match(/[\u0900-\u097F]/) ? "sa" : "en"}>{shlokaDetails!.sanskrit}</p>
              </div>
            )}
            {shlokaDetails!.english && (
              <div>
                <h4 className="font-semibold text-lg md:text-xl mb-1 text-accent">English Translation:</h4>
                <p className="text-foreground/80">{shlokaDetails!.english}</p>
              </div>
            )}
            {shlokaDetails!.hindi && (
              <div>
                <h4 className="font-semibold text-lg md:text-xl mb-1 text-accent">Hindi Translation (हिन्दी अनुवाद):</h4>
                <p className="font-devanagari text-foreground/90" lang="hi">{shlokaDetails!.hindi}</p>
              </div>
            )}
          </SectionCard>
        )}

        {personalizedInsight && (
            <SectionCard 
              title="Personalized Insight for You" 
              icon={<UserCheck size={24} />}
              description="AI-generated insight connecting the pattern to your situation."
              cardClassName="md:col-span-1 !bg-gradient-to-br from-secondary/20 via-card/80 to-card/70 !shadow-md !shadow-primary/10 hover:!shadow-card-hover"
            >
            <p className="leading-relaxed md:leading-loose">{personalizedInsight}</p>
            </SectionCard>
        )}

        {((enhancedGuidance && enhancedGuidance.length > 0) || (pattern.dharmic_guidance && pattern.dharmic_guidance.length > 0)) && (
          <SectionCard 
            title="Actionable Dharmic Guidance" 
            icon={<ListChecks size={24} />}
            description="Practical steps and reflections. AI-enhanced steps are marked."
            cardClassName="md:col-span-1 !border-primary/20 !border-2 !shadow-md !shadow-primary/10 hover:!shadow-card-hover"
          >
            <ul className="list-disc pl-5 space-y-2.5 text-foreground/90">
              {enhancedGuidance && enhancedGuidance.map((item, index) => (
                <li key={`ai-guidance-${index}`} className="leading-snug">{item} <span className="text-xs text-muted-foreground/80">(AI-enhanced)</span></li>
              ))}
              {pattern.dharmic_guidance && pattern.dharmic_guidance.map((item, index) => (
                <li key={`pattern-guidance-${index}`} className="text-foreground/80 leading-snug">{item} <span className="text-xs text-muted-foreground/70">(from core pattern)</span></li>
              ))}
            </ul>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
GuidanceDisplayComponent.displayName = 'GuidanceDisplayComponent';
export const GuidanceDisplay = React.memo(GuidanceDisplayComponent);

