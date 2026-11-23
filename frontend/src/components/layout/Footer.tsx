'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/site.config';
import { LEGAL_DISCLAIMER } from '@/lib/constants';
import { BackToTop } from './BackToTop';
import { ThunSparkLogo } from '@/components/ui/ThunSparkLogo';
import { FooterSpotlightText } from './FooterSpotlightText';

export interface FooterProps {
  hasTeamMembers?: boolean;
  contact?: {
    email: string;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    socials: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      github?: string;
    };
  };
}

export function Footer({ hasTeamMembers = false, contact }: FooterProps) {
  const pathname = usePathname();

  // Disable public website footer on admin & studio routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/studio')) {
    return null;
  }

  const email = contact?.email || siteConfig.contact.email;
  const socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  } = {
    ...siteConfig.contact.socials,
    ...(contact?.socials || {}),
  };

  return (
    <footer className="bg-alt border-t border-line text-soft pt-16 pb-12 text-sm relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <ThunSparkLogo size={32} textClassName="text-xl" />
            </Link>
            <p className="text-xs text-meta leading-relaxed max-w-xs">
              Strategy, execution, and measurement — for businesses that want growth they can prove.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Instagram
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Twitter
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  YouTube
                </a>
              )}
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Strategic Services */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink mb-4 font-semibold">
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.serviceGroups.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/services#${g.id}`}
                    className="hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-meta font-mono text-[10px]">{g.number}</span>
                    <span>{g.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-line">
                <Link
                  href="/services"
                  className="text-accent hover:text-accent-hi font-medium"
                >
                  All 10 Services &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink mb-4 font-semibold">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About ThunSpark
                </Link>
              </li>
              <li>
                <Link href="/engagement-models" className="hover:text-accent transition-colors">
                  Engagement Models
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-accent transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Insights & Thinking
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
              {/* Team link appears ONLY when at least 1 member is published */}
              {hasTeamMembers && (
                <li>
                  <Link href="/team" className="hover:text-accent transition-colors">
                    The Team
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact & Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Direct Inquiries */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink mb-4 font-semibold">
              Start a Conversation
            </h4>
            <p className="text-xs text-meta leading-relaxed">
              Tell us what&apos;s holding your growth back. We diagnose before we prescribe.
            </p>
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              className="w-full text-center"
              data-analytics-cta="footer_diagnostics"
            >
              Book a strategy call
            </Button>
            <div className="space-y-1.5 text-xs text-meta pt-1">
              <div>
                Direct: <a href={`mailto:${email}`} className="text-ink hover:text-accent">{email}</a>
              </div>
              {/* Strictly render phone/whatsapp/address ONLY if real non-placeholder values */}
              {contact?.phone && (
                <div>
                  Tel: <a href={`tel:${contact.phone}`} className="text-ink hover:text-accent">{contact.phone}</a>
                </div>
              )}
              {contact?.whatsapp && (
                <div>
                  WhatsApp: <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent">{contact.whatsapp}</a>
                </div>
              )}
              {contact?.address && (
                <div>
                  Office: <span className="text-soft">{contact.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Large ThunSpark shadow text with interactive cursor spotlight glow */}
      <FooterSpotlightText />

      <Container>
        {/* Legal Disclaimer & Performance Clause per Guide §R9 */}
        <div className="pt-8 border-t border-line text-xs text-meta leading-relaxed space-y-3">
          <p>{LEGAL_DISCLAIMER}</p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-meta pt-2">
            <span>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="hover:text-accent transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* 44px Fixed Circular Back to Top Button */}
      <BackToTop />
    </footer>
  );
}
