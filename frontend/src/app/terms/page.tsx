import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: { absolute: 'Terms of Service | ThunSpark Digital Growth Agency' },
  description:
    'Terms of service, engagement conditions, and legal guidelines governing interactions with ThunSpark agency.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                LEGAL AGREEMENT
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-4">
                Terms of Service.
              </h1>
              <p className="font-mono text-xs text-meta">
                Last Updated: November 2024
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl space-y-12 text-soft text-sm md:text-base leading-relaxed">
            <div>
              <h2 className="font-display font-medium text-2xl text-ink mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or browsing the website <span className="text-ink">thunspark.agency</span>, requesting a strategy call, or engaging ThunSpark for digital growth services, you agree to comply with and be bound by these Terms of Service.
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-ink mb-4">
                2. Nature of Services
              </h2>
              <p>
                ThunSpark provides digital growth strategy, web design & development, search engine optimization, performance media management, and data instrumentation services. Statements of Work (SOW) executed separately detail specific deliverables, timelines, and commercial payment terms.
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-ink mb-4">
                3. Marketing Outcomes & Performance Disclaimer
              </h2>
              <div className="p-4 rounded-lg bg-card border border-line text-xs text-soft leading-relaxed mb-3">
                <strong className="text-ink block mb-1">Standard Industry Disclaimer:</strong>
                Marketing outcomes vary based on business conditions, competitive factors, advertising platform policy shifts, client product-market fit, unit economics, and implementation velocity. Past case studies and sample results do not guarantee identical future outcomes.
              </div>
              <p>
                ThunSpark commits to senior-level architectural rigor, transparent reporting, and disciplined execution, but does not guarantee arbitrary financial returns or platform-specific algorithms beyond human control.
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-ink mb-4">
                4. Intellectual Property
              </h2>
              <p>
                All website design, proprietary growth frameworks, and website copy on this site are the intellectual property of ThunSpark. Upon full settlement of invoices, all bespoke client assets, codebases, and custom designs created under an active SOW transfer to the respective client.
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-ink mb-4">
                5. Contact & Inquiries
              </h2>
              <p>
                For questions regarding these terms, please contact us at <a href="mailto:hello@thunspark.agency" className="text-accent hover:underline">hello@thunspark.agency</a>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
