'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { getAttributionPayload } from '@/components/analytics/AttributionTracker';

const BUDGET_OPTIONS = [
  { value: 'under_1k', label: 'Under $1,000 / mo' },
  { value: '1k_3k', label: '$1,000 – $3,000 / mo' },
  { value: '3k_5k', label: '$3,000 – $5,000 / mo' },
  { value: '5k_10k', label: '$5,000 – $10,000 / mo' },
  { value: '10k_plus', label: '$10,000+ / mo' },
];

export function ContactForm() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    budget: '',
    improvement_goal: '',
    message: '',
    website_hp: '', // spam honeypot
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim()) {
        setErrorMessage('Please provide your name and work email.');
        return;
      }
      setErrorMessage('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const attribution = getAttributionPayload();
      const payload = {
        ...formData,
        attribution,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/leads/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.website_hp?.[0] || 'Unable to submit inquiry. Please try again.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <Card className="p-8 sm:p-12 text-center max-w-xl mx-auto border-accent/40 bg-surface-elevated">
        <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-display font-bold text-2xl text-text-primary mb-3">
          Inquiry Received.
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Thank you for reaching out, {formData.name}. Our growth strategy team will review your commercial objectives and respond within 24 hours.
        </p>
        <Button href="/" variant="secondary">
          Return to Homepage
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-10 max-w-2xl mx-auto border-border bg-surface relative overflow-hidden">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/80">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                step === s
                  ? 'bg-accent text-white'
                  : step > s
                  ? 'bg-accent-soft text-accent'
                  : 'bg-surface-elevated text-text-muted border border-border'
              }`}
            >
              0{s}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s ? 'text-text-primary' : 'text-text-muted'
              }`}
            >
              {s === 1 ? 'Contact Info' : s === 2 ? 'Project Scope' : 'Your Challenge'}
            </span>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center gap-3 text-red-300 text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden honeypot field for bot trap */}
      <input
        type="text"
        name="website_hp"
        value={formData.website_hp}
        onChange={(e) => updateField('website_hp', e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <form onSubmit={step === 3 ? handleSubmit : handleNext}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Your Name *"
                  placeholder="e.g. Alex Morgan"
                  required
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
                <Input
                  label="Work Email *"
                  type="email"
                  placeholder="alex@company.com"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Company Name"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                />
                <Input
                  label="Website / Digital Presence"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary">
                  <span>Continue</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-3">
                  Monthly Growth / Marketing Investment Budget
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => updateField('budget', opt.value)}
                      className={`p-3.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                        formData.budget === opt.value
                          ? 'border-accent bg-accent-soft text-accent'
                          : 'border-border bg-surface-elevated text-text-secondary hover:border-border-strong hover:text-text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary">
                  <span>Next Step</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <Textarea
                label="What is your primary growth bottleneck?"
                placeholder="e.g. High cost per acquisition on Google Ads, poor website conversion rate, or lack of search positioning."
                value={formData.improvement_goal}
                onChange={(e) => updateField('improvement_goal', e.target.value)}
              />

              <Textarea
                label="Additional Context / Details (Optional)"
                placeholder="Tell us what you've tried and what timeline you are targeting."
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
              />

              <div className="pt-4 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === 'submitting'}
                  data-analytics-cta="submit_contact_form"
                  data-analytics-location="contact_page"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Send Inquiry'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Card>
  );
}
