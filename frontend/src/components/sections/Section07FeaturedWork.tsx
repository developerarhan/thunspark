import React from 'react';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WorkClientSelector } from '@/components/work/WorkClientSelector';
import type { HomeWorkClient } from '@/lib/content/types';
import {
  getFallbackHomeWorkClients,
  MAX_HOME_CLIENTS,
  sortHomeWorkClients,
} from '@/lib/content/projects';

interface Section07FeaturedWorkProps {
  clients?: readonly HomeWorkClient[];
  totalCount?: number;
}

export function Section07FeaturedWork({
  clients,
  totalCount,
}: Section07FeaturedWorkProps) {
  const sourceClients = clients ?? sortHomeWorkClients(getFallbackHomeWorkClients());
  const visibleClients = sourceClients.slice(0, MAX_HOME_CLIENTS);
  const resolvedTotal = totalCount ?? sourceClients.length;

  return (
    <Section id="work" tone="base">
      <Container>
        <SectionHeading
          eyebrow="SELECTED WORK"
          title={
            <>
              Work we&apos;re <span className="font-italic-accent">proud</span> of.
            </>
          }
          copy="Scope-first showcases spanning e-commerce, manufacturing, and consumer brands."
        />

        <WorkClientSelector clients={visibleClients} totalCount={resolvedTotal} />
      </Container>
    </Section>
  );
}
