'use client';

import React from 'react';
import {
  Activity,
  ArrowRight,
  Compass,
  Layout,
  Leaf,
  Mail,
  Megaphone,
  PenTool,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Badge';

export type ServiceIconKey =
  | 'leaf'
  | 'trending-up'
  | 'megaphone'
  | 'pen-tool'
  | 'compass'
  | 'layout'
  | 'mail'
  | 'shield'
  | 'activity';

export interface ShowcaseServiceItem {
  slug: string;
  name: string;
  shortName: string;
  groupId: 'attract' | 'engage' | 'convert' | 'optimize';
  groupName: string;
  groupNumber: string;
  icon: ServiceIconKey;
  promise: string;
  bullets: [string, string, string];
}

interface ServiceShowcaseCardProps {
  service: ShowcaseServiceItem;
  displayIndex: string;
  isActive: boolean;
  reduced: boolean;
  cardRef?: (el: HTMLElement | null) => void;
  onCardFocus?: () => void;
}

const SERVICE_ICONS: Record<
  ServiceIconKey,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  leaf: Leaf,
  'trending-up': TrendingUp,
  megaphone: Megaphone,
  'pen-tool': PenTool,
  compass: Compass,
  layout: Layout,
  mail: Mail,
  shield: Shield,
  activity: Activity,
};

export function ServiceShowcaseCard({
  service,
  displayIndex,
  isActive,
  reduced,
  cardRef,
  onCardFocus,
}: ServiceShowcaseCardProps) {
  const Icon = SERVICE_ICONS[service.icon] ?? Compass;

  return (
    <article
      ref={cardRef}
      data-active={isActive ? 'true' : 'false'}
      className="group h-full"
    >
      <Card
        data-cursor="EXPLORE"
        className={`h-full p-[clamp(1rem,2.1vh,1.5rem)] flex flex-col justify-between gap-[clamp(0.65rem,1.4vh,1.1rem)] bg-card border-line hover:border-line-strong hover:bg-elevated group-data-[active=true]:bg-elevated group-data-[active=true]:border-accent ${
          reduced ? '' : 'transition-colors duration-200'
        }`}
      >
        <div className="space-y-[clamp(0.6rem,1.3vh,0.95rem)]">
          {/* Top Row: Slightly rotated line-icon tile, group tag & outlined index */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-elevated text-soft -rotate-3 group-data-[active=true]:border-accent/50 group-data-[active=true]:text-accent ${
                  reduced ? '' : 'transition-colors duration-200'
                }`}
              >
                <Icon size={18} />
              </div>
              <Tag
                variant="default"
                className="group-data-[active=true]:border-accent/40 group-data-[active=true]:bg-accent/10 group-data-[active=true]:text-accent"
              >
                {service.groupNumber} &middot; {service.groupName}
              </Tag>
            </div>

            <span
              aria-hidden="true"
              className="font-display font-extrabold text-[clamp(2rem,3.8vh,2.75rem)] leading-none tracking-tight select-none shrink-0 text-transparent [-webkit-text-stroke:1px_rgba(255,210,31,0.18)] group-data-[active=true]:[-webkit-text-stroke:1px_rgba(255,210,31,0.45)]"
            >
              {displayIndex}
            </span>
          </div>

          {/* Title & One-Line Promise */}
          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-[clamp(1.0625rem,1.35vw,1.25rem)] leading-snug text-ink">
              {service.name}
            </h3>
            <p className="text-[clamp(0.8rem,1.05vw,0.875rem)] text-soft leading-relaxed line-clamp-2">
              {service.promise}
            </p>
          </div>

          {/* Exactly 3 Derived Core Bullets */}
          <ul
            className={`space-y-[clamp(0.3rem,0.75vh,0.5rem)] pt-2 border-t border-line text-[clamp(0.75rem,0.95vw,0.84rem)] text-soft opacity-85 lg:opacity-65 group-data-[active=true]:opacity-100 ${
              reduced ? '' : 'transition-opacity duration-200'
            }`}
          >
            {service.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted group-data-[active=true]:bg-accent"
                />
                <span className="leading-snug">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Primary Action CTA */}
        <div className="pt-1">
          <Button
            href={`/services/${service.slug}`}
            variant="secondary"
            size="sm"
            data-cursor="EXPLORE"
            data-analytics-cta={`services_showcase_${service.slug}`}
            aria-current={isActive ? 'true' : undefined}
            onFocus={onCardFocus}
            className="w-full justify-between gap-2 bg-card text-ink border-line hover:border-line-strong hover:bg-elevated group-data-[active=true]:bg-accent group-data-[active=true]:text-canvas group-data-[active=true]:border-accent group-data-[active=true]:hover:bg-accent-hi group-data-[active=true]:font-semibold"
          >
            <span>Explore {service.shortName}</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </article>
  );
}
