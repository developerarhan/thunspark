'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { updateGoogleConsent } from '@/lib/analytics/gtm';
import { ShieldCheck, Settings } from 'lucide-react';
import Link from 'next/link';

const CONSENT_COOKIE_KEY = 'thunspark_cookie_consent';

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [consentAnalytics, setConsentAnalytics] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(true);

  useEffect(() => {
    setMounted(true);
    const savedConsent = Cookies.get(CONSENT_COOKIE_KEY);
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        updateGoogleConsent({
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    const preferences = {
      necessary: true,
      analytics,
      marketing,
      updated_at: new Date().toISOString(),
    };

    Cookies.set(CONSENT_COOKIE_KEY, JSON.stringify(preferences), { expires: 365 });

    updateGoogleConsent({ analytics, marketing });

    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleRejectAll = () => {
    saveConsent(false, false);
  };

  const handleSaveCustom = () => {
    saveConsent(consentAnalytics, consentMarketing);
  };

  if (!mounted || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50"
      >
        <div className="p-6 rounded-2xl bg-[#111111]/95 backdrop-blur-xl border border-[#252525] text-[#F5F5F0]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[#171717] text-[#FFD21F] border border-[#252525]">
              <ShieldCheck size={18} />
            </div>
            <h4 className="font-display font-medium text-sm text-[#F5F5F0]">
              Privacy & Cookie Preferences
            </h4>
          </div>

          <p className="text-[#8A8A85] text-xs leading-relaxed mb-4">
            We use privacy-first telemetry to understand engagement and improve our growth architecture in compliance with GDPR and Indian DPDP. See our{' '}
            <Link href="/privacy-policy" className="text-[#FFD21F] underline hover:text-[#F2C718]">
              Privacy Policy
            </Link>.
          </p>

          {showPreferences && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pt-3 pb-4 border-t border-[#252525] text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium block text-[#F5F5F0]">Strictly Necessary</span>
                  <span className="text-[11px] text-[#8A8A85]">Required for site routing and enquiry dispatch.</span>
                </div>
                <span className="font-mono text-[10px] text-[#FFD21F] uppercase font-bold">Always Active</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium block text-[#F5F5F0]">Analytics & Performance</span>
                  <span className="text-[11px] text-[#8A8A85]">Helps us measure page speed and scroll depth.</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentAnalytics}
                  onChange={(e) => setConsentAnalytics(e.target.checked)}
                  className="accent-[#FFD21F] w-4 h-4 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium block text-[#F5F5F0]">Marketing & Conversion Tags</span>
                  <span className="text-[11px] text-[#8A8A85]">Measures ad attribution and campaign signals.</span>
                </div>
                <input
                  type="checkbox"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                  className="accent-[#FFD21F] w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            {!showPreferences ? (
              <>
                <Button
                  onClick={handleAcceptAll}
                  size="sm"
                  variant="primary"
                  className="w-full sm:w-auto text-xs py-2"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleRejectAll}
                  size="sm"
                  variant="secondary"
                  className="w-full sm:w-auto text-xs py-2"
                >
                  Essential Only
                </Button>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="text-xs text-[#8A8A85] hover:text-[#F5F5F0] transition-colors flex items-center gap-1 sm:ml-auto p-1 cursor-pointer"
                >
                  <Settings size={13} />
                  <span>Customize</span>
                </button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSaveCustom}
                  size="sm"
                  variant="primary"
                  className="w-full text-xs py-2"
                >
                  Save My Preferences
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
