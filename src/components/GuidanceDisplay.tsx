
'use client';

import React from 'react';
import type { Pattern } from '@/types/dharmic';
import type { ShlokaDetails } from '@/app/[locale]/page'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, BookOpenText, Sparkles, ArrowLeft, Zap, ListChecks, Brain, MessageSquareQuote } from 'lucide-react';
// Accordion components are no longer needed here if Sacred Verse is the only item and not in an accordion.

interface GuidanceDisplayProps {
  pattern: Pattern; 
  enhancedGuidance: string[] | null;
  shlokaDetails: ShlokaDetails | null;
  onReset: () => void;
  isDynamicPattern: boolean; 
}

const GuidanceDisplayComponent = ({ 
  pattern, 
  enhancedGuidance, 
  shlokaDetails, 
  onReset,
  isDynamicPattern 
}: GuidanceDisplayProps) => {

  const coreGuidanceFromPattern = pattern.dharmic_guidance || []; 
  const aiEnhancedGuidance = enhancedGuidance || []; 
  const hasAnyActionableGuidance = aiEnhancedGuidance.length > 0 || coreGuidanceFromPattern.length > 0;

  const displayPersonalizedInsight = pattern.modern_context;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <Button 
        variant="outline" 
        onClick={onReset} 
        className="mb-1 group text-sm py-2 px-4 hover:bg-accent/20 hover:text-accent-foreground hover:border-accent transition-all flex items-center self-start border-border hover:border-primary/70"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Describe New Situation
      </Button>

      <Card className="overflow-hidden shadow-xl border-primary/30 bg-card">
        <CardHeader className="p-4 sm:p-5 bg-primary/10">
          <div className="flex items-center mb-1">
            <Zap size={24} className="mr-2.5 text-primary" />
            <CardTitle className="text-xl sm:text-2xl font-semibold text-primary tracking-tight card-title">
              {pattern.pattern_name}
            </CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            {isDynamicPattern ? "Personalized Spiritual Insight" : "Interpreted Archetypal Pattern"}
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="deeper" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-t border-border bg-card p-0">
            <TabsTrigger value="deeper" className="rounded-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none py-2.5 sm:py-3 text-xs sm:text-sm">
              <Brain className="mr-1.5 h-4 w-4" /> Deeper Wisdom
            </TabsTrigger>
            <TabsTrigger value="insight" className="rounded-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none py-2.5 sm:py-3 text-xs sm:text-sm">
              <Lightbulb className="mr-1.5 h-4 w-4" /> Key Insight
            </TabsTrigger>
            <TabsTrigger value="actions" className="rounded-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none py-2.5 sm:py-3 text-xs sm:text-sm" disabled={!hasAnyActionableGuidance}>
             <ListChecks className="mr-1.5 h-4 w-4" /> Steps
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deeper" className="p-4 sm:p-5">
            {shlokaDetails && (shlokaDetails.sanskrit || shlokaDetails.english || shlokaDetails.hindi) ? (
              <div className="space-y-3">
                <h4 className="flex items-center text-md font-semibold text-foreground/90">
                  <BookOpenText className="mr-2.5 h-5 w-5 text-accent" />
                  Sacred Verse
                </h4>
                <div className="ml-1 pl-4 border-l-2 border-primary/30 space-y-3 text-sm">
                  {shlokaDetails.sanskrit && (
                    <div>
                      <span className="font-semibold text-accent">Sanskrit:</span>
                      <p className="font-devanagari text-foreground/90 mt-0.5 leading-relaxed">{shlokaDetails.sanskrit}</p>
                    </div>
                  )}
                  {shlokaDetails.english && (
                    <div>
                      <span className="font-semibold text-accent">English Translation:</span>
                      <p className="text-foreground/80 mt-0.5 leading-relaxed">{shlokaDetails.english}</p>
                    </div>
                  )}
                  {shlokaDetails.hindi && (
                    <div>
                      <span className="font-semibold text-accent">Hindi Translation:</span>
                      <p className="font-devanagari text-foreground/80 mt-0.5 leading-relaxed">{shlokaDetails.hindi}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
                <MessageSquareQuote className="w-12 h-12 mb-3 text-primary/50" />
                <p className="text-sm">Sacred wisdom is being sought for your situation.</p>
                <p className="text-xs mt-1">If this message persists, the AI may be having trouble finding a perfectly fitting verse.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insight" className="p-4 sm:p-5">
            {displayPersonalizedInsight ? (
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{displayPersonalizedInsight}</p>
            ) : (
               <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
                <Lightbulb className="w-12 h-12 mb-3 text-primary/50" />
                <p className="text-sm">A unique insight is being tailored for you.</p>
                <p className="text-xs mt-1">This may take a few moments to fully manifest.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="p-4 sm:p-5">
            {aiEnhancedGuidance.length > 0 ? (
              <ul className="space-y-2.5">
                {aiEnhancedGuidance.map((item, index) => (
                  <li key={`ai-guidance-${index}`} className="flex items-start text-sm sm:text-base">
                    <Sparkles className="text-primary mr-2.5 mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-foreground/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
                <ListChecks className="w-12 h-12 mb-3 text-primary/50" />
                <p className="text-sm">Actionable steps are being thoughtfully prepared.</p>
                <p className="text-xs mt-1">Guidance will appear here once revealed.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
GuidanceDisplayComponent.displayName = 'GuidanceDisplayComponent';
export const GuidanceDisplay = React.memo(GuidanceDisplayComponent);
