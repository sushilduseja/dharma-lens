'use client';

import React, { type ElementType, type FormEvent, type Dispatch, type SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Locale } from '@/i18n/config';
import { 
  Loader2, XCircle, Wand2, Award, Activity, HeartHandshake, Compass, Unlink2,
  ShieldOff, Edit, EyeOff, Users, UserCheck as UserCheckIcon, Search, 
  TrendingDown, Flame, ArchiveX, History, CloudDrizzle, Anchor, ShieldAlert, 
  Users2, SmilePlus, HeartCrack, 
  GitFork, HelpCircle, Layers, Waypoints, Brush, 
  Link as LinkIcon, Network, Shuffle, Repeat, EyeOff as DenialEyeOff 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SituationCanvasProps {
  lang?: Locale;
  t: (key: string) => string;
  situation: string;
  setSituation: Dispatch<SetStateAction<string>>;
  isSubmitting: boolean;
  handleSubmit: (e: FormEvent) => Promise<void>;
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
    category: "Self-Perception & Worthiness",
    categoryId: "self-perception",
    icon: Award,
    themes: [
      { id: 'karmic_echo_unworthiness', label: "Echo of Unworthiness", text: "I constantly doubt myself and feel like an imposter, even when I succeed. It's like I'm never good enough, no matter what I achieve. This feeling often traces back to things I heard in childhood or when I compare myself to others on social media.", icon: ShieldOff },
      { id: 'burden_of_perfectionism', label: "Burden of Perfectionism", text: "I drive myself relentlessly to be flawless in everything I do. This leads to a lot of anxiety, burnout, and sometimes I procrastinate because I'm afraid of making mistakes, which I see as personal failures.", icon: Edit },
      { id: 'mask_of_invisibility', label: "Mask of Invisibility", text: "I often feel overlooked or unrecognized, like my contributions don't matter. This makes me withdraw or silence myself in groups or relationships.", icon: EyeOff },
      { id: 'curse_of_comparison', label: "Curse of Comparison", text: "I constantly measure myself against others, which leads to dissatisfaction, jealousy, and feelings of inferiority. It's hard to appreciate my own unique journey.", icon: Users },
      { id: 'mirror_of_pride', label: "Mirror of Pride", text: "I sometimes have an inflated sense of self, find it hard to accept feedback, or feel superior to others. I know this pride can be blinding.", icon: UserCheckIcon },
      { id: 'quest_for_identity', label: "Quest for Identity", text: "I often feel lost, undefined, or fragmented, struggling to answer 'Who am I?' in a world of shifting roles and labels. I'm searching for a sense of belonging and self-discovery.", icon: Search },
    ]
  },
  {
    category: "Emotional Challenges",
    categoryId: "emotional-challenges",
    icon: Activity,
    themes: [
      { id: 'cycle_of_envy', label: "Cycle of Envy", text: "When I see others succeed, especially on social media or at work, I often feel jealous or like I'm lacking something. This resentment makes me unhappy, but it's hard to break the habit of comparing myself.", icon: TrendingDown },
      { id: 'shadow_of_anger', label: "Shadow of Anger", text: "I have a short fuse and my anger often damages my relationships and stresses me out. I think it often masks deeper pain or a feeling that things are unfair, but I struggle to control my reactions.", icon: Flame },
      { id: 'burden_of_guilt', label: "Burden of Guilt", text: "A past mistake weighs heavily on me, creating a deep sense of guilt that prevents me from feeling joy or worthy of love. I keep replaying it and can't seem to forgive myself.", icon: ArchiveX },
      { id: 'shadow_of_resentment', label: "Shadow of Resentment", text: "I find myself holding onto past hurts and replaying old wounds. This bitterness clouds my present joy and makes it hard to move on.", icon: History },
      { id: 'river_of_grief', label: "River of Grief", text: "I'm experiencing deep sorrow after a significant loss—be it a loved one, a dream, or a part of my identity. I find myself resisting the pain or unable to express it fully.", icon: CloudDrizzle },
      { id: 'weight_of_regret', label: "Weight of Regret", text: "I'm haunted by past choices and find it hard to forgive myself or move forward. This regret feels like a heavy burden I can't shake off.", icon: Anchor },
      { id: 'spell_of_fear', label: "Spell of Fear", text: "I'm often overwhelmed by fear—fear of failure, rejection, or the unknown. This fear sometimes paralyzes me, leading to inaction or avoidance of what I need to do.", icon: ShieldAlert },
    ]
  },
  {
    category: "Relationships & Connection",
    categoryId: "relationships-connection",
    icon: HeartHandshake,
    themes: [
      { id: 'loneliness_in_crowd', label: "Loneliness in the Crowd", text: "Despite being surrounded by people or constantly connected online, I often feel deeply alone, misunderstood, and unseen. I crave genuine connection.", icon: Users2 },
      { id: 'mask_of_people_pleasing', label: "Mask of People-Pleasing", text: "I have a chronic need to please others, which often leads to me betraying my own needs, feeling exhausted, and secretly resentful. I find it hard to set boundaries.", icon: SmilePlus },
      { id: 'wound_of_betrayal', label: "Wound of Betrayal", text: "I'm carrying deep pain from a past betrayal by someone I trusted. It's made me guarded and cynical, and I struggle to trust others or even myself.", icon: HeartCrack },
    ]
  },
  {
    category: "Life Path & Purpose",
    categoryId: "life-path-purpose",
    icon: Compass,
    themes: [
      { id: 'dharma_confusion_crossroads', label: "Dharma Crossroads", text: "I feel paralyzed by big life choices in my career and relationships. I'm torn between what society and my family expect of me and what my heart truly wants. It's hard to know what my true purpose is.", icon: GitFork },
      { id: 'veil_of_ignorance', label: "Veil of Ignorance", text: "I feel like I'm just drifting through life, unaware of my true self, and repeating the same unconscious patterns. This lack of self-awareness keeps me stuck in suffering and confusion.", icon: HelpCircle },
      { id: 'burden_of_expectations', label: "Burden of Expectations", text: "I feel crushed under the weight of expectations from my parents, society, or my culture. This pressure causes a lot of anxiety, and sometimes I just want to rebel against it all.", icon: Layers },
      { id: 'labyrinth_of_confusion', label: "Labyrinth of Confusion", text: "I feel lost and unable to see the way forward. There's a lack of clarity, and I'm unsure which path to choose or what direction to take in my life.", icon: Waypoints },
      { id: 'garden_of_creativity', label: "Garden of Creativity", text: "I feel like my creative flow is blocked. I'm afraid of judgment or find it difficult to express my unique gifts and ideas to the world.", icon: Brush }
    ]
  },
  {
    category: "Attachment & Letting Go",
    categoryId: "attachment-letting-go",
    icon: Unlink2,
    themes: [
      { id: 'maya_attachment_cycle', label: "Golden Chains of Attachment", text: "I'm always worried about keeping up with a certain lifestyle and tend to measure my self-worth by what I own. Even when I get the things I thought I wanted, I still feel empty and just want more.", icon: LinkIcon },
      { id: 'web_of_attachment', label: "Web of Attachment", text: "I find myself clinging to people, possessions, or specific outcomes, which breeds a lot of anxiety and disappointment. Letting go feels threatening, even when I know it's necessary for my growth.", icon: Network },
      { id: 'fear_of_change', label: "Fear of Change", text: "Even positive changes trigger anxiety and resistance in me. I cling to the familiar because the unknown feels unsafe, even when my comfort zone isn't serving me anymore.", icon: Shuffle },
      { id: 'dance_of_desire', label: "Dance of Desire", text: "I'm caught in a cycle of endless wanting—whether it's things, experiences, or validation from people. I never seem to feel truly satisfied or content.", icon: Repeat },
      { id: 'veil_of_denial', label: "Veil of Denial", text: "I tend to ignore uncomfortable realities or pretend problems don’t exist. Facing the truth or accepting change feels overwhelming at times.", icon: DenialEyeOff },
    ]
  }
];

export function SituationCanvas({ t, situation, setSituation, isSubmitting, handleSubmit }: SituationCanvasProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="situation">{t('guidance.situation.title')}</Label>
        <div className="text-sm text-muted-foreground">
          {t('guidance.situation.description')}
        </div>
        <Textarea
          id="situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder={t('guidance.situation.placeholder')}
          className="min-h-[200px]"
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('guidance.situation.submitting')}
          </>
        ) : (
          t('guidance.situation.submit')
        )}
      </Button>
    </form>
  );
}





