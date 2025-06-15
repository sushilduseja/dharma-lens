
'use client';

import React, { type Dispatch, type SetStateAction, type ElementType } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Loader2, XCircle, Wand2, Award, HeartHandshake, Flame, ShieldAlert,
  GitFork, Layers, Network, Users2, ThumbsUp, Telescope, Leaf, Scale, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SituationCanvasProps {
  userSituation: string;
  setUserSituation: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  isLoading: boolean;
}

interface SampleSituation {
  id: string;
  label: string;
  text: string;
  icon?: ElementType; 
}

interface CategorizedSampleSituations {
  category: string;
  categoryId: string;
  icon: ElementType; 
  themes: SampleSituation[];
}

const categorizedSampleSituations: CategorizedSampleSituations[] = [
  {
    category: "Self & Emotions",
    categoryId: "self-emotions",
    icon: Award,
    themes: [
      { id: 'karmic_echo_unworthiness', label: "Unworthiness", text: "I constantly doubt myself and feel like an imposter, even when I succeed.", icon: ShieldAlert },
      { id: 'burden_of_perfectionism', label: "Perfectionism", text: "I drive myself relentlessly to be flawless, leading to anxiety and burnout.", icon: Layers },
      { id: 'shadow_of_anger', label: "Anger", text: "I have a short fuse and my anger often damages my relationships.", icon: Flame },
      { id: 'fear_of_unknown', label: "Fear of Future", text: "Uncertainty about what's next paralyzes me and fills me with anxiety.", icon: Telescope },
    ]
  },
  {
    category: "Relationships & Purpose",
    categoryId: "relationships-purpose",
    icon: HeartHandshake,
    themes: [
      { id: 'loneliness_in_crowd', label: "Loneliness", text: "Despite being surrounded by people, I often feel deeply alone.", icon: Users2 },
      { id: 'dharma_confusion_crossroads', label: "Life Crossroads", text: "I feel paralyzed by big life choices in my career and relationships.", icon: GitFork },
      { id: 'web_of_attachment', label: "Attachment", text: "I find myself clinging to people or outcomes, which breeds anxiety.", icon: Network },
      { id: 'seeking_meaning_material', label: "Beyond Success", text: "I've achieved material success but still feel an inner void and seek deeper meaning.", icon: Leaf },
    ]
  },
  {
    category: "Spiritual & Ethical",
    categoryId: "spiritual-ethical",
    icon: Scale, // Changed from Balance
    themes: [
        { id: 'moral_dilemma_work', label: "Ethical Dilemma", text: "I'm facing a moral conflict at work that compromises my values.", icon: Scale }, // Changed from Balance
        { id: 'spiritual_dryness', label: "Spiritual Dryness", text: "My spiritual practices feel empty, and I've lost my connection to the divine.", icon: BrainCircuit },
    ]
  }
];

const SituationCanvasComponent = ({ userSituation, setUserSituation, onSubmit, isLoading }: SituationCanvasProps) => {
  const handleSampleClick = (text: string) => {
    setUserSituation(text);
    const textarea = document.getElementById("userSituationTextarea");
    if (textarea) {
        textarea.focus();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <Label htmlFor="userSituationTextarea" className="sr-only">
          Describe your situation:
        </Label>
        <Textarea
          id="userSituationTextarea"
          placeholder="E.g., I feel torn between my career and family expectations..."
          value={userSituation}
          onChange={(e) => setUserSituation(e.target.value)}
          rows={3} 
          className={cn(
            "text-base resize-none min-h-[80px] max-h-[120px]", 
            "bg-input border-input-border placeholder:text-muted-foreground/70",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            "shadow-lg hover:shadow-primary/20 focus:shadow-primary/30",
            "transition-all duration-200 text-foreground" 
          )}
          disabled={isLoading}
        />
        {userSituation && !isLoading && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => setUserSituation('')}
            aria-label="Clear text"
            title="Clear text"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-foreground/80 text-center">
          Or tap an inspired theme:
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {categorizedSampleSituations.flatMap(categoryGroup => categoryGroup.themes).map((sample) => (
            <Button
              key={sample.id}
              variant="outline"
              onClick={() => handleSampleClick(sample.text)}
              disabled={isLoading}
              className={cn(
                "h-auto py-1.5 px-3 rounded-md group", 
                "bg-card/80 hover:bg-primary/20 border-border hover:border-primary/40",
                "text-foreground/80 hover:text-primary", 
                "font-normal text-xs sm:text-sm", 
                "transition-all duration-150 ease-out",
                "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                "whitespace-nowrap shadow-sm hover:shadow-md"
              )}
              title={sample.text}
            >
              {React.createElement(sample.icon || ThumbsUp, { className: "mr-1.5 h-3.5 w-3.5 shrink-0 text-primary/70 group-hover:text-primary transition-colors duration-150" })}
              {sample.label}
            </Button>
          ))}
        </div>
      </div>
        <Button
        onClick={onSubmit}
        disabled={isLoading || userSituation.trim() === ''}
        className={cn(
          "w-full text-base sm:text-lg py-2.5 sm:py-3",
          "font-semibold rounded-lg shadow-xl hover:shadow-primary/50", 
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isLoading ? "opacity-70 cursor-not-allowed bg-muted text-muted-foreground" : "",
          !isLoading && userSituation.trim() !== '' && "unveil-button-shimmer text-primary-foreground", 
          (isLoading || userSituation.trim() === '') && !(!isLoading && userSituation.trim() !== '') && "bg-primary hover:bg-primary/90 text-primary-foreground" 
        )}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Unveiling Your Path...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-5 w-5" />
            Unveil Guidance
          </>
        )}
      </Button>
    </div>
  );
}
SituationCanvasComponent.displayName = 'SituationCanvasComponent';
export const SituationCanvas = React.memo(SituationCanvasComponent);
