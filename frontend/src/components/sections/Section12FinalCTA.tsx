import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FINAL_CTA } from '@/lib/constants';
import { siteConfig } from '@/site.config';
import { ArrowRight, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export function Section12FinalCTA() {
  return (
    <section className="py-24 md:py-36 bg-alt border-t border-line relative overflow-hidden bg-grain">
      {/* Approved Radial Yellow Glow Gradient per Guide §D1 §11 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(600px at 85% 0%, rgba(255, 210, 31, 0.07), transparent 70%)',
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Direct Info & Deliverables (5 cols) */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
                Direct Contact
              </span>
              <div className="space-y-3 text-sm text-soft">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-accent shrink-0" />
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="hover:text-ink transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-accent shrink-0" />
                  <span>{siteConfig.contact.location} &bull; Serving Ambitious Brands</span>
                </div>
              </div>
            </div>

            {/* What You Get Mini-List */}
            <div className="p-6 rounded-xl bg-card border border-line space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink block">
                What you get on a strategy call:
              </span>
              <ul className="space-y-2 text-xs text-soft">
                {FINAL_CTA.teasers.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} className="text-accent shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: H2 & Conversion CTA Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.03em] text-ink">
              Ready to find your{' '}
              <span className="font-italic-accent">bottleneck?</span>
            </h2>

            <p className="text-soft text-lg sm:text-xl leading-relaxed max-w-xl font-sans">
              {FINAL_CTA.copy}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                href={FINAL_CTA.primaryCta.href}
                variant="primary"
                size="lg"
                data-analytics-cta="final_cta_book"
              >
                <span>{FINAL_CTA.primaryCta.label}</span>
                <ArrowRight size={18} className="ml-2 inline" />
              </Button>

              <Link
                href={`mailto:${FINAL_CTA.secondaryEmail}`}
                className="text-sm font-mono text-soft hover:text-accent transition-colors py-3 px-4"
              >
                Or email {FINAL_CTA.secondaryEmail}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
