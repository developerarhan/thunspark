import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: { absolute: 'Cookie Policy · ThunSpark' },
  description:
    'Overview of cookies and local storage mechanisms utilized across the ThunSpark platform, Google Consent Mode v2 implementation, and preference controls.',
  ogTitle: 'Cookie Policy · ThunSpark',
  ogDescription:
    'Overview of cookies and local storage mechanisms utilized across the ThunSpark platform, Google Consent Mode v2 implementation, and preference controls.',
  path: '/cookie-policy',
});

export default function CookiePolicyPage() {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
  ];

  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-28">
      <Container>
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <SectionHeading
            eyebrow="TRANSPARENCY & CONSENT"
            title="Cookie Policy"
            copy="How we use cookies, local storage, and Google Consent Mode v2 on the ThunSpark platform."
          />
        </div>

        <div className="max-w-3xl mx-auto space-y-12 text-sm leading-relaxed text-soft">
          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <h2 className="font-display font-medium text-xl text-ink">
              1. What Are Cookies and Local Storage?
            </h2>
            <p>
              Cookies are small text files placed on your device by websites you visit. They are widely
              used to make websites work efficiently, provide security, and deliver reporting insight
              to website operators. In addition to HTTP cookies, we utilize modern browser storage
              mechanisms (such as <code className="text-accent bg-elevated px-1.5 py-0.5 rounded text-xs font-mono">sessionStorage</code>)
              solely to enhance site interaction fluidity.
            </p>
          </section>

          {/* Section 2: What We Use (Only what is actually implemented) */}
          <section className="space-y-4">
            <h2 className="font-display font-medium text-xl text-ink">
              2. Cookies & Storage Technologies We Use
            </h2>
            <p>
              We maintain a minimal telemetry footprint. The specific storage mechanisms currently
              implemented are:
            </p>

            <div className="rounded-xl border border-line bg-card overflow-hidden">
              <div className="p-4 border-b border-line bg-elevated/50 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                Active Telemetry & Storage Inventory
              </div>
              <div className="divide-y divide-line text-xs">
                {/* Essential */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-ink font-bold">thunspark_cookie_consent</span>
                    <span className="text-accent">Essential / Necessary</span>
                  </div>
                  <p className="text-soft">
                    Stores your cookie consent preferences (necessary, analytics, marketing) for 365 days
                    so you are not prompted on every page refresh.
                  </p>
                </div>

                {/* Performance Session */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-ink font-bold">sessionStorage: thunspark_visited</span>
                    <span className="text-accent">Functional / UI Performance</span>
                  </div>
                  <p className="text-soft">
                    Stores a temporary session boolean to prevent repeating the initial preloader animation
                    for returning views during the same active browser session. Clears when your browser closes.
                  </p>
                </div>

                {/* Google Consent Mode v2 */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-ink font-bold">Google Consent Mode v2 (GTM)</span>
                    <span className="text-meta">Analytics & Marketing (Conditional)</span>
                  </div>
                  <p className="text-soft">
                    By default, signals for <code className="text-xs font-mono text-meta">analytics_storage</code>,{' '}
                    <code className="text-xs font-mono text-meta">ad_storage</code>,{' '}
                    <code className="text-xs font-mono text-meta">ad_user_data</code>, and{' '}
                    <code className="text-xs font-mono text-meta">ad_personalization</code> are denied. They
                    are granted only after you explicitly click &ldquo;Accept All&rdquo; or enable them in custom preferences.
                  </p>
                </div>

                {/* Vercel Analytics */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-ink font-bold">Vercel Analytics & Speed Insights</span>
                    <span className="text-meta">Privacy-Preserving Telemetry</span>
                  </div>
                  <p className="text-soft">
                    Used to monitor Core Web Vitals and route load latency without storing persistent cross-site tracking cookies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Consent and Legal Basis TODO(LEGAL) */}
          <section className="space-y-4">
            <h2 className="font-display font-medium text-xl text-ink">
              3. Consent and Regulatory Compliance
            </h2>
            <p>
              {/* TODO(LEGAL): Confirm DPDP Act and ePrivacy compliance formulation */}
              Our banner complies with the European Union ePrivacy Directive, GDPR, and India&apos;s Digital
              Personal Data Protection (DPDP) Act principles by adopting a strict <strong>fail-closed default</strong>.
              No non-essential tracking or marketing identifiers are written before you express your choice.
            </p>
          </section>

          {/* Section 4: How to Change Your Preferences */}
          <section className="space-y-4">
            <h2 className="font-display font-medium text-xl text-ink">
              4. How to Manage and Revoke Consent
            </h2>
            <p>
              You can withdraw or adjust your consent choices at any time:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Browser Cookie Clearing:</strong> Deleting the cookie named{' '}
                <code className="text-xs font-mono bg-elevated px-1.5 py-0.5 rounded text-accent">thunspark_cookie_consent</code>{' '}
                will immediately reset your state and display the preference banner upon your next visit.
              </li>
              <li>
                <strong>Browser Settings:</strong> You can configure your browser (Chrome, Safari, Firefox, Edge) to block
                third-party cookies or notify you whenever a cookie is set. Note that disabling essential cookies may impact
                website functionality.
              </li>
            </ul>
          </section>

          {/* Section 5: Inquiries & Contact */}
          <section className="space-y-4 pt-4 border-t border-line">
            <h2 className="font-display font-medium text-xl text-ink">
              5. Questions Regarding This Policy
            </h2>
            <p>
              {/* TODO(LEGAL): Add registered Data Protection Officer or legal email */}
              For any privacy or cookie-related inquiries, please contact us at{' '}
              <a href="mailto:hello@thunspark.agency" className="text-accent hover:underline">
                hello@thunspark.agency
              </a>{' '}
              or review our comprehensive{' '}
              <Link href="/privacy-policy" className="text-accent hover:underline">
                Privacy Policy
              </Link>.
            </p>
            <p className="text-xs text-meta pt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
