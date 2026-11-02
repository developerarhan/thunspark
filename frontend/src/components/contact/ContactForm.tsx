'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { getAttributionPayload } from '@/components/analytics/AttributionTracker';

const SERVICE_OPTIONS = [
  'Social Media Marketing',
  'Performance Marketing',
  'SEO Strategy',
  'Content Marketing',
  'Brand Identity & Strategy',
  'Creative Production',
  'Web Design & Dev',
  'Landing Pages & CRO',
  'Analytics Audit',
  'Growth Consulting',
];

const CHALLENGE_OPTIONS = [
  'Ads that burn budget without pipeline',
  'Traffic that doesn’t convert below the fold',
  'Inconsistent or invisible content output',
  'Website that undersells the business',
  'Data everywhere, actionable insight nowhere',
  'Growth that plateaued across key channels',
  'Other / Full-stack growth overhaul',
];

const BUDGET_OPTIONS = [
  'Under $2,000 / month',
  '$2,000 – $5,000 / month',
  '$5,000 – $10,000 / month',
  '$10,000+ / month',
  'Project-based sprint (Fixed fee)',
];

const TIMELINE_OPTIONS = [
  'Immediately (Within 2 weeks)',
  'This quarter (Within 30–60 days)',
  'Planning ahead / Exploring options',
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    workEmail: '',
    company: '',
    website: '',
    servicesNeeded: [] as string[],
    businessChallenge: '',
    budgetRange: '',
    timeline: '',
    message: '',
    consent: false,
    website_hp: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const exists = prev.servicesNeeded.includes(service);
      return {
        ...prev,
        servicesNeeded: exists
          ? prev.servicesNeeded.filter((s) => s !== service)
          : [...prev.servicesNeeded, service],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.workEmail.trim()) {
      setErrorMessage('Please provide your name and work email.');
      setStatus('error');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('Please agree to the privacy policy to proceed.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const attribution = getAttributionPayload();
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attribution,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <Card className="p-8 sm:p-12 text-center bg-[#111111] border-[#252525]">
        <div className="w-16 h-16 rounded-full bg-[#171717] border border-[#FFD21F] text-[#FFD21F] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#F5F5F0] mb-3">
          Strategy Call Request Received.
        </h3>
        <p className="text-[#8A8A85] text-sm leading-relaxed max-w-md mx-auto mb-8">
          Thank you, {formData.name}. Our senior growth team will review your website and current footprint, then reply within 24 hours to schedule our conversation.
        </p>
        <Button href="/" variant="secondary" size="md">
          <span>Return to Homepage</span>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-10 bg-[#111111] border-[#252525]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website_hp"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website_hp}
            onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
          />
        </div>

        {/* Name & Work Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
              Your Name <span className="text-[#FFD21F]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Sarah Chen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm text-[#F5F5F0] placeholder:text-[#8A8A85] focus:outline-none focus:border-[#FFD21F] transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
              Work Email <span className="text-[#FFD21F]">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="sarah@company.com"
              value={formData.workEmail}
              onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm text-[#F5F5F0] placeholder:text-[#8A8A85] focus:outline-none focus:border-[#FFD21F] transition-colors"
            />
          </div>
        </div>

        {/* Company & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
              Company / Brand
            </label>
            <input
              type="text"
              placeholder="Acme Growth Inc."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm text-[#F5F5F0] placeholder:text-[#8A8A85] focus:outline-none focus:border-[#FFD21F] transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://company.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm text-[#F5F5F0] placeholder:text-[#8A8A85] focus:outline-none focus:border-[#FFD21F] transition-colors"
            />
          </div>
        </div>

        {/* Services Needed (Pills) */}
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
            Disciplines you are interested in:
          </label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((service) => {
              const isSelected = formData.servicesNeeded.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    isSelected
                      ? 'bg-[#FFD21F] text-[#050505] font-bold'
                      : 'bg-[#171717] text-[#8A8A85] border border-[#252525] hover:border-[#353535] hover:text-[#F5F5F0]'
                  }`}
                >
                  {service}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Business Challenge */}
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
            Primary Bottleneck You Are Experiencing
          </label>
          <select
            value={formData.businessChallenge}
            onChange={(e) => setFormData({ ...formData, businessChallenge: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm focus:outline-none focus:border-[#FFD21F] transition-colors ${
              formData.businessChallenge ? 'text-[#F5F5F0]' : 'text-[#8A8A85]'
            }`}
          >
            <option value="" className="bg-[#171717] text-[#8A8A85]">
              Select your biggest challenge...
            </option>
            {CHALLENGE_OPTIONS.map((challenge) => (
              <option key={challenge} value={challenge} className="bg-[#171717] text-[#F5F5F0]">
                {challenge}
              </option>
            ))}
          </select>
        </div>

        {/* Budget & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
              Monthly Growth Budget (Optional)
            </label>
            <select
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm focus:outline-none focus:border-[#FFD21F] transition-colors ${
                formData.budgetRange ? 'text-[#F5F5F0]' : 'text-[#8A8A85]'
              }`}
            >
              <option value="" className="bg-[#171717] text-[#8A8A85]">
                Select a range...
              </option>
              {BUDGET_OPTIONS.map((budget) => (
                <option key={budget} value={budget} className="bg-[#171717] text-[#F5F5F0]">
                  {budget}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
              Target Timeline (Optional)
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm focus:outline-none focus:border-[#FFD21F] transition-colors ${
                formData.timeline ? 'text-[#F5F5F0]' : 'text-[#8A8A85]'
              }`}
            >
              <option value="" className="bg-[#171717] text-[#8A8A85]">
                Select a timeline...
              </option>
              {TIMELINE_OPTIONS.map((t) => (
                <option key={t} value={t} className="bg-[#171717] text-[#F5F5F0]">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message / Context */}
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] block mb-2">
            Context & Growth Goals
          </label>
          <textarea
            rows={4}
            placeholder="Tell us what you have tried, what currently works, and where you want to be in 90 days..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-[#171717] border border-[#252525] text-sm text-[#F5F5F0] placeholder:text-[#6F6F6A] focus:outline-none focus:border-[#FFD21F] transition-colors"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="consent"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 w-4 h-4 rounded bg-[#171717] border border-[#252525] text-[#FFD21F] focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="consent" className="text-xs text-[#8A8A85] leading-relaxed cursor-pointer">
            I agree to the processing of my details according to the{' '}
            <Link href="/privacy-policy" className="text-[#FFD21F] hover:underline">
              Privacy Policy
            </Link>
            . We will never share or sell your company information.
          </label>
        </div>

        {/* Error message display */}
        {status === 'error' && errorMessage && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#F2C718] text-[#050505] font-display font-medium text-base transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Submitting request...</span>
              </>
            ) : (
              <>
                <span>Book a strategy call</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}
