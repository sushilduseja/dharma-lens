'use client';

import React from 'react';
import type { Locale } from '@/i18n/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, ListChecks, Brain, BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidanceDisplayProps {
  lang?: Locale;
  t: (key: string) => string;
  guidance: any; // Define a more specific type later if possible
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

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
  description,
  cardClassName,
  titleClassName,
  contentClassName,
}) => (
  <Card className={cn("mb-6 last:mb-0 shadow-card-highlight bg-card/90", cardClassName)}>
    <CardHeader>
      <CardTitle className={cn("flex items-center gap-3 text-xl md:text-2xl", titleClassName)}>
        {icon}
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className={cn("space-y-4", contentClassName)}>
      {children}
    </CardContent>
  </Card>
);

export function GuidanceDisplay({ lang, t, guidance }: GuidanceDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      {guidance && (
        <>
          <SectionCard
            title={t('guidance.display.insight.title')}
            icon={<Lightbulb className="h-6 w-6" />}
          >
            {/* Display insight content from guidance prop */}
            <p>{guidance.insight}</p>
          </SectionCard>

          <SectionCard
            title={t('guidance.display.dharmic.title')}
            icon={<BookOpenText className="h-6 w-6" />}
          >
            {/* Display dharmic guidance content from guidance prop */}
            <p>{guidance.dharmic}</p>
          </SectionCard>

          <SectionCard
            title={t('guidance.display.pattern.title')}
            icon={<ListChecks className="h-6 w-6" />}
          >
            {/* Display pattern guidance content from guidance prop */}
            <p>{guidance.pattern}</p>
          </SectionCard>

          <SectionCard
            title={t('guidance.display.action.title')}
            icon={<Brain className="h-6 w-6" />}
          >
            {/* Display action guidance content from guidance prop */}
            <p>{guidance.action}</p>
          </SectionCard>
        </>
      )}
    </div>
  );
}

