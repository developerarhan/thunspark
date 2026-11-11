import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/motion/Reveal';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, Clock, ShieldCheck } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: { absolute: 'Book a Strategy Call | ThunSpark' },
  description:
    'Diagnose your growth bottleneck. 30 minutes with our senior team. We will review your acquisition funnel and tell you what we would fix first.',
  ogTitle: 'Book a Strategy Call | ThunSpark',
  ogDescription:
    'We solve business problems. Marketing is how. Request a 30-minute growth diagnostic session.',
  path: '/contact',
});

const CONTACT_FAQS = [
  {
    q: 'What actually happens on a strategy call?',
    a: 'Thirty focused minutes. We review your website, ad accounts, and acquisition funnel before we get on the phone. We identify the primary growth bottleneck we see, explain why it is leaking revenue, and tell you exactly what we would fix first — whether or not you decide to work with us.',
  },
  {
    q: 'Do I need to prepare anything beforehand?',
    a: 'Just have a clear sense of your primary growth goal and current customer acquisition channels. If you have access to Google Analytics or ad platform dashboards, having high-level metrics handy helps us provide deeper immediate value.',
  },
  {
    q: 'How fast do you respond to inquiries?',
    a: 'Every inquiry is reviewed directly by a senior growth strategist. We respond within 24 business hours with scheduling options and initial observations.',
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                LET&apos;S TALK GROWTH
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6">
                Find your bottleneck. <br />
                <span className="text-meta">Fix the engine.</span>
              </h1>
              <p className="text-soft text-base sm:text-lg leading-relaxed">
                Tell us where your growth is stuck and what you are trying to achieve. We start with the business problem — not a generic sales pitch.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. FORM & SLA SECTION */}
      <section className="py-20 md:py-28 border-b border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Direct Details & Expectations */}
            <div className="lg:col-span-5 space-y-8">
              <Reveal>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                    WHAT TO EXPECT
                  </span>
                  <h2 className="font-display font-medium text-2xl md:text-3xl text-ink tracking-tight mb-4">
                    Our 3-step call commitment.
                  </h2>
                  <p className="text-soft text-sm leading-relaxed mb-6">
                    We respect your time. Here is our operating protocol for every inbound conversation:
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        num: '01',
                        title: 'Pre-call audit',
                        desc: 'We inspect your public web presence, ad footprints, and category competitors before we meet.',
                      },
                      {
                        num: '02',
                        title: 'Bottleneck diagnosis',
                        desc: 'We isolate whether your leak is acquisition intent, conversion friction, or unit economics.',
                      },
                      {
                        num: '03',
                        title: 'Honest recommendation',
                        desc: 'If you need a simple landing page rather than an agency retainer, that is what we will recommend.',
                      },
                    ].map((step) => (
                      <div key={step.num} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-line">
                        <span className="font-mono text-xs font-bold text-accent shrink-0 mt-0.5">
                          {step.num}
                        </span>
                        <div>
                          <h4 className="font-display font-medium text-sm text-ink mb-1">
                            {step.title}
                          </h4>
                          <p className="text-xs text-soft leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Direct Reach */}
              <Reveal delay={0.1}>
                <Card className="p-6 bg-alt border-line space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent block">
                    Direct Contact Channels
                  </span>

                  <div className="space-y-3 text-sm">
                    <a
                      href="mailto:hello@thunspark.agency"
                      className="flex items-center gap-3 text-ink hover:text-accent transition-colors"
                    >
                      <Mail size={16} className="text-accent" />
                      <span>hello@thunspark.agency</span>
                    </a>

                    <div className="flex items-center gap-3 text-meta">
                      <Clock size={16} className="text-accent" />
                      <span>SLA: 24 business hours response</span>
                    </div>

                    <div className="flex items-center gap-3 text-meta">
                      <ShieldCheck size={16} className="text-accent" />
                      <span>Mutual NDA respected on request</span>
                    </div>
                  </div>
                </Card>
              </Reveal>
            </div>

            {/* Right Column: Single Card Form */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. MINI FAQ */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                  STRATEGY CALL DETAILS
                </span>
                <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight">
                  Frequently asked questions.
                </h2>
              </div>
            </Reveal>

            <Accordion items={CONTACT_FAQS} />
          </div>
        </Container>
      </section>
    </div>
  );
}
