import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, ShieldCheck, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Thunspark — Start a Conversation',
  description:
    "Let's find the growth bottleneck. Tell us where you're stuck, what you're trying to achieve, and we'll start with the business problem, not a sales pitch.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <Section className="pt-16 pb-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Growth Diagnostic
              </Badge>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight mb-6">
                Let&apos;s Find the <span className="text-accent">Growth Bottleneck.</span>
              </h1>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
                Tell us where you&apos;re stuck, what you&apos;re trying to achieve, and we&apos;ll start from there. No generic sales decks or prepackaged retainers.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.15}>
            <ContactForm />
          </ScrollReveal>

          {/* Reassurance Grid */}
          <div className="max-w-2xl mx-auto mt-16 pt-12 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-text-secondary">
            <div className="flex flex-col items-center gap-2">
              <Clock size={20} className="text-accent" />
              <span className="font-semibold text-text-primary">24-Hour Response</span>
              <span>Direct feedback from senior growth strategists.</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck size={20} className="text-accent" />
              <span className="font-semibold text-text-primary">Commercial NDA</span>
              <span>All proprietary data and unit economics kept strictly confidential.</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail size={20} className="text-accent" />
              <span className="font-semibold text-text-primary">Direct Access</span>
              <a href="mailto:contact@thunspark.agency" className="hover:text-accent transition-colors">
                contact@thunspark.agency
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
