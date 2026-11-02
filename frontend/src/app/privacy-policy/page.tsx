import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Privacy Policy | ThunSpark Digital Growth Agency',
  description:
    'Our commitment to privacy, data transparency, and security. Learn how ThunSpark collects, uses, and safeguards your business information.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
                COMPLIANCE & TRANSPARENCY
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F0] tracking-tight mb-4">
                Privacy Policy.
              </h1>
              <p className="font-mono text-xs text-[#8A8A85]">
                Last Updated: November 2024
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl space-y-12 text-[#8A8A85] text-sm md:text-base leading-relaxed">
            <div>
              <h2 className="font-display font-medium text-2xl text-[#F5F5F0] mb-4">
                1. Overview & Commitment
              </h2>
              <p>
                ThunSpark (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website <span className="text-[#F5F5F0]">thunspark.agency</span>. We provide digital growth strategy, web development, performance marketing, and analytics audit services. This policy outlines how we handle personal and proprietary commercial data submitted to our agency.
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-[#F5F5F0] mb-4">
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-[#F5F5F0]">Inquiry Information:</strong> Name, work email address, company name, website URL, project scope, budget ranges, and growth notes submitted via our strategy call forms.</li>
                <li><strong className="text-[#F5F5F0]">Technical & Telemetry Data:</strong> IP address, browser type, device information, and anonymous session interactions collected via privacy-first analytics (Vercel Web Analytics) with zero third-party cross-site tracking.</li>
                <li><strong className="text-[#F5F5F0]">Diagnostic Inputs:</strong> Marketing metrics, target CAC/ROAS, and channel data voluntarily shared during initial discovery calls.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-[#F5F5F0] mb-4">
                3. How We Use Information
              </h2>
              <p className="mb-3">
                We collect and process your information strictly for legitimate commercial purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To evaluate inbound growth inquiries and conduct pre-call digital audits.</li>
                <li>To schedule and conduct growth diagnostic strategy calls.</li>
                <li>To prepare bespoke scopes of work and project proposals.</li>
                <li>To fulfill contractual obligations and provide client reporting.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-[#F5F5F0] mb-4">
                4. Data Sharing & Third Parties
              </h2>
              <p>
                <strong className="text-[#F5F5F0]">We never sell, rent, or trade your personal or business data.</strong> We share data only with verified, enterprise-grade cloud providers necessary to deliver our website infrastructure (such as Vercel for hosting, Resend for transactional email dispatch, and Cloudflare for anti-bot validation).
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-[#F5F5F0] mb-4">
                5. Confidentiality & NDA
              </h2>
              <p>
                All proprietary client information, ad spend figures, and commercial unit economics shared with ThunSpark during inquiries or active retainers are treated as strictly confidential. We execute bilateral Non-Disclosure Agreements (NDAs) upon request before reviewing private dashboards.
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-[#F5F5F0] mb-4">
                6. Your Rights
              </h2>
              <p>
                Depending on your location (including under GDPR, UK GDPR, and applicable Indian data protection laws), you have rights to access, correct, export, or request deletion of your personal data held in our systems.
              </p>
            </div>

            <div>
              <h2 className="font-display font-medium text-2xl text-[#F5F5F0] mb-4">
                7. Contact Us
              </h2>
              <p>
                For data privacy requests or inquiries regarding our data handling practices, please email <a href="mailto:hello@thunspark.agency" className="text-[#FFD21F] hover:underline">hello@thunspark.agency</a>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
