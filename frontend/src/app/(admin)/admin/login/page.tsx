'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred during sign-in.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base text-ink px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <svg
              width="26"
              height="26"
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
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-display font-extrabold text-2xl tracking-tight">
              THUN<span className="text-accent">SPARK</span>
            </span>
          </div>
          <h1 className="text-xl font-display font-semibold text-ink">
            Agency Operations & CRM
          </h1>
          <p className="text-xs text-soft font-mono mt-1">
            Restricted to authorized ThunSpark staff
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-line rounded-2xl p-7 sm:p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-5 font-mono">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-meta mb-1.5">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@thunspark.agency"
                className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-line text-ink text-sm placeholder:text-soft/60 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-meta mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-elevated border border-line text-ink text-sm placeholder:text-soft/60 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-accent text-canvas font-semibold text-sm hover:bg-accent-hi transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,210,31,0.2)]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Enter Operations Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-[11px] text-meta font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-accent" />
              <span>AES-256 / Neon DB</span>
            </span>
            <span>v1.0 Operations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
