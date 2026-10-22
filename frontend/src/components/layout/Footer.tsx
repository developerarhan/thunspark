import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Mail, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border bg-bg-secondary pt-16 pb-12 text-sm text-text-secondary">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <span className="font-display font-extrabold text-2xl tracking-tight text-text-primary">
                THUN<span className="text-accent">SPARK</span>
              </span>
            </Link>
            <p className="text-text-secondary max-w-sm leading-relaxed">
              Digital marketing built around your growth. We turn strategy, content, search, websites, and conversion channels into a connected commercial engine.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://linkedin.com/company/thunspark"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors p-2 rounded-lg bg-surface border border-border flex items-center justify-center"
                aria-label="Thunspark LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a
                href="mailto:contact@thunspark.agency"
                className="text-text-muted hover:text-accent transition-colors p-2 rounded-lg bg-surface border border-border"
                aria-label="Email Thunspark"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-display font-semibold text-text-primary uppercase tracking-wider text-xs">
              Navigation
            </h4>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
              <Link href="/services" className="hover:text-text-primary transition-colors">Services</Link>
              <Link href="/about" className="hover:text-text-primary transition-colors">About</Link>
              <Link href="/projects" className="hover:text-text-primary transition-colors">Projects</Link>
              <Link href="/blog" className="hover:text-text-primary transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
            </div>
          </div>

          {/* Connect & Engage */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="font-display font-semibold text-text-primary uppercase tracking-wider text-xs">
              Start A Dialogue
            </h4>
            <p className="text-text-muted text-xs leading-relaxed pt-2">
              Have a growth problem worth solving? We examine bottlenecks first before prescribing solutions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold text-sm pt-2 group"
            >
              <span>Explore Partnership</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            © {currentYear} Thunspark. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="hover:text-text-secondary transition-colors">
              Cookie Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-text-secondary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
