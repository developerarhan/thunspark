'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/site.config';
import { LEGAL_DISCLAIMER } from '@/lib/constants';
import { BackToTop } from './BackToTop';

export function Footer() {
  return (
    <footer className="bg-alt border-t border-line text-soft pt-16 pb-12 text-sm relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-accent"
              >
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  fill="#FFD21F"
                  stroke="#FFD21F"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="font-display font-extrabold text-xl tracking-tight text-ink">
                THUN<span className="text-accent">SPARK</span>
              </span>
            </Link>
            <p className="text-xs text-meta leading-relaxed max-w-xs">
              Strategy, execution, and measurement — for businesses that want growth they can prove.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs">
              <a
                href={siteConfig.contact.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.contact.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                Instagram
              </a>
              <a
                href={siteConfig.contact.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                Twitter
              </a>
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
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact & Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                  Privacy Policy
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
            <div className="text-xs text-meta">
              Direct: <a href={`mailto:${siteConfig.contact.email}`} className="text-ink hover:text-accent">{siteConfig.contact.email}</a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Performance Clause per Guide §R9 */}
        <div className="pt-8 border-t border-line text-xs text-meta leading-relaxed space-y-3">
          <p>{LEGAL_DISCLAIMER}</p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-meta pt-2">
            <span>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
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
