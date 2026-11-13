'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BookingButton } from '@/components/ui/BookingButton';
import { useMotion } from '@/components/motion/MotionProvider';
import type { HomeWorkClient } from '@/lib/content/types';
import { ClientMediaTile } from './ClientMediaTile';

const AUTOPLAY_INTERVAL_MS = 6000;
const AUTOPLAY_MAX_CLIENTS = 6;

interface WorkClientSelectorProps {
  clients: readonly HomeWorkClient[];
  totalCount: number;
}

function formatCounter(index: number, total: number): string {
  return `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}

export function WorkClientSelector({ clients, totalCount }: WorkClientSelectorProps) {
  const { reduced } = useMotion();
  const baseId = useId();

  const count = clients.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [stoppedPermanently, setStoppedPermanently] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [scrollEdges, setScrollEdges] = useState({ top: false, bottom: false });

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const safeActiveIndex = count > 0 ? Math.min(activeIndex, count - 1) : 0;
  const activeClient = count > 0 ? clients[safeActiveIndex] : null;

  const supportsAutoplay = count >= 2 && count <= AUTOPLAY_MAX_CLIENTS && !reduced;
  const isPausedByInteraction = isHovered || hasFocusWithin || userPaused;
  const isAutoplayActive = supportsAutoplay && !stoppedPermanently;
  const isAutoplayTicking = isAutoplayActive && !isPausedByInteraction;
  const isScrollableList = count >= 6;

  const updateScrollEdges = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || !isScrollableList) {
      setScrollEdges((prev) =>
        !prev.top && !prev.bottom ? prev : { top: false, bottom: false }
      );
      return;
    }
    const canTop = el.scrollTop > 4;
    const canBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
    setScrollEdges((prev) =>
      prev.top === canTop && prev.bottom === canBottom
        ? prev
        : { top: canTop, bottom: canBottom }
    );
  }, [isScrollableList]);

  useEffect(() => {
    const raf = window.requestAnimationFrame(updateScrollEdges);
    return () => window.cancelAnimationFrame(raf);
  }, [count, updateScrollEdges]);

  // Keep active tab visible inside scrollable 6+ list without scrolling the window
  useEffect(() => {
    if (!isScrollableList) return;
    const container = scrollContainerRef.current;
    const activeTab = tabRefs.current[safeActiveIndex];
    if (!container || !activeTab) return;

    const cTop = container.scrollTop;
    const cHeight = container.clientHeight;
    const tTop = activeTab.offsetTop;
    const tHeight = activeTab.offsetHeight;
    const pad = 12;

    if (tTop < cTop + pad) {
      container.scrollTo({
        top: Math.max(0, tTop - pad),
        behavior: reduced ? 'auto' : 'smooth',
      });
    } else if (tTop + tHeight > cTop + cHeight - pad) {
      container.scrollTo({
        top: tTop + tHeight - cHeight + pad,
        behavior: reduced ? 'auto' : 'smooth',
      });
    }
  }, [isScrollableList, reduced, safeActiveIndex]);

  // Desktop 6s autoplay interval
  useEffect(() => {
    if (!isAutoplayTicking || count < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [count, isAutoplayTicking]);

  // Empty state (0 clients)
  if (count === 0) {
    return (
      <div className="p-10 sm:p-14 rounded-2xl bg-card border border-line text-center max-w-2xl mx-auto space-y-5">
        <h3 className="font-display font-bold text-2xl text-ink">
          Case studies are being prepared.
        </h3>
        <p className="text-sm sm:text-base text-soft leading-relaxed">
          We&apos;re documenting recent client engagements across e-commerce, B2B, and consumer brands. Talk with our team to walk through work relevant to your goals.
        </p>
        <div className="pt-1">
          <BookingButton location="work_empty_state" variant="primary" size="md">
            <span>Book a strategy call</span>
            <ArrowRight size={16} className="ml-2" />
          </BookingButton>
        </div>
      </div>
    );
  }

  const handleManualSelect = (index: number) => {
    setActiveIndex(index);
    setStoppedPermanently(true);
  };

  const handleTabFocus = (index: number) => {
    if (index !== safeActiveIndex) {
      setActiveIndex(index);
      setStoppedPermanently(true);
    }
  };

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowDown') {
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowUp') {
      nextIndex = (index - 1 + count) % count;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = count - 1;
    }

    if (nextIndex === null) return;
    e.preventDefault();
    handleManualSelect(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const handleWrapperBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setHasFocusWithin(false);
    }
  };

  const activeTabId = `${baseId}-tab-${safeActiveIndex}`;
  const panelId = `${baseId}-panel`;

  const viewAllLabel =
    totalCount > count ? `View all ${totalCount} projects` : 'View all projects';

  const isSingle = count === 1;
  const isStretchedList = count >= 2 && count <= 5;

  const renderPanelContent = (
    client: HomeWorkClient,
    index: number,
    showPauseControl: boolean
  ) => (
    <div className="h-full flex flex-col justify-between gap-6">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-line">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs text-meta tabular-nums shrink-0">
            {formatCounter(index, count)}
          </span>
          <span className="px-3 py-1 rounded-full bg-elevated border border-line font-mono text-[11px] uppercase tracking-wider text-accent font-semibold truncate">
            {client.industry}
          </span>
        </div>

        {showPauseControl && (
          <button
            type="button"
            disabled={stoppedPermanently}
            onClick={() => setUserPaused((prev) => !prev)}
            aria-label={
              stoppedPermanently
                ? 'Autoplay stopped after manual selection'
                : userPaused
                  ? 'Play client showcase rotation'
                  : 'Pause client showcase rotation'
            }
            aria-pressed={userPaused || stoppedPermanently}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-elevated border border-line font-mono text-[11px] uppercase tracking-wider transition-colors shrink-0 ${
              stoppedPermanently
                ? 'text-meta opacity-60 cursor-default'
                : 'hover:border-line-strong text-soft hover:text-ink cursor-pointer'
            }`}
          >
            {userPaused || stoppedPermanently ? (
              <>
                <Play size={12} className="text-accent" />
                <span>{stoppedPermanently ? 'Manual' : 'Play'}</span>
              </>
            ) : (
              <>
                <Pause size={12} className="text-accent" />
                <span>Pause</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Content Row */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-8 min-h-0">
        <ClientMediaTile client={client} variant="featured" />

        <div className="min-w-0 flex-1 flex flex-col items-start gap-4">
          <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-ink tracking-tight leading-[1.1] text-balance">
            {client.client}
          </h3>

          <p className="text-soft text-sm sm:text-base leading-relaxed line-clamp-3">
            {client.shortDescription}
          </p>

          <div className="pt-2">
            <Button
              href={`/projects/${client.slug}`}
              variant="primary"
              size="md"
              data-cursor="VIEW"
            >
              <span>Explore the project</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* DESKTOP (lg+): Adaptive Tablist Selector or Centered Single Card */}
      <div
        className="hidden lg:block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setHasFocusWithin(true)}
        onBlurCapture={handleWrapperBlur}
      >
        {isSingle && activeClient ? (
          <div className="max-w-4xl mx-auto p-8 lg:p-10 rounded-2xl bg-card border border-line">
            {renderPanelContent(activeClient, 0, false)}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* Featured Panel (8 cols) */}
            <div
              role="tabpanel"
              id={panelId}
              aria-labelledby={activeTabId}
              className="col-span-8 lg:h-[clamp(420px,54vh,520px)] p-8 lg:p-9 rounded-2xl bg-card border border-line overflow-hidden"
            >
              {activeClient && (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeClient.slug}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -12 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                    }
                    className="h-full"
                  >
                    {renderPanelContent(
                      activeClient,
                      safeActiveIndex,
                      supportsAutoplay
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Client Tab List (4 cols) */}
            <div className="col-span-4 relative lg:h-[clamp(420px,54vh,520px)]">
              <div
                ref={scrollContainerRef}
                onScroll={updateScrollEdges}
                role="tablist"
                aria-label="Client projects"
                aria-orientation="vertical"
                className={
                  isStretchedList
                    ? 'h-full flex flex-col gap-2'
                    : 'h-full overflow-y-auto work-list-scroll pr-1.5 flex flex-col gap-2.5'
                }
              >
                {clients.map((client, idx) => {
                  const isActive = idx === safeActiveIndex;
                  const tabId = `${baseId}-tab-${idx}`;

                  return (
                    <button
                      key={client.slug}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      id={tabId}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={panelId}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => handleManualSelect(idx)}
                      onFocus={() => handleTabFocus(idx)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={`relative overflow-hidden w-full text-left px-4 rounded-xl border transition-colors flex items-center gap-3.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isStretchedList
                          ? 'flex-1 min-h-0 py-1.5'
                          : 'shrink-0 py-2.5'
                      } ${
                        isActive
                          ? 'bg-elevated border-line-strong'
                          : 'bg-card border-line hover:border-line-strong hover:bg-elevated'
                      }`}
                    >
                      <ClientMediaTile client={client} variant="compact" />

                      <div className="min-w-0 flex-1">
                        <div className="font-display font-bold text-base text-ink truncate">
                          {client.client}
                        </div>
                        <div className="font-mono text-[11px] uppercase tracking-wider text-meta truncate mt-0.5">
                          {client.industry}
                        </div>
                      </div>

                      {isActive && isAutoplayActive && (
                        <span
                          key={`${safeActiveIndex}-${userPaused}`}
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left pointer-events-none"
                          style={{
                            animationName: 'work-autoplay-progress',
                            animationDuration: `${AUTOPLAY_INTERVAL_MS}ms`,
                            animationTimingFunction: 'linear',
                            animationFillMode: 'forwards',
                            animationPlayState: isPausedByInteraction
                              ? 'paused'
                              : 'running',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Scrollable top/bottom fade masks for 6+ items */}
              {isScrollableList && scrollEdges.top && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 right-2 h-8 bg-gradient-to-b from-base to-transparent rounded-t-xl"
                />
              )}
              {isScrollableList && scrollEdges.bottom && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-base to-transparent rounded-b-xl"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE & TABLET (< lg): Pure CSS scroll-snap carousel, no tabs, no autoplay */}
      <div className="lg:hidden">
        {isSingle && activeClient ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-line flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-meta tabular-nums">
                {formatCounter(0, 1)}
              </span>
              <span className="px-3 py-1 rounded-full bg-elevated border border-line font-mono text-[11px] uppercase tracking-wider text-accent font-semibold truncate">
                {activeClient.industry}
              </span>
            </div>

            <ClientMediaTile client={activeClient} variant="mobile" />

            <div className="space-y-2.5">
              <h3 className="font-display font-bold text-2xl text-ink tracking-tight leading-snug">
                {activeClient.client}
              </h3>
              <p className="text-sm text-soft leading-relaxed">
                {activeClient.shortDescription}
              </p>
            </div>

            <div className="pt-1">
              <Button href={`/projects/${activeClient.slug}`} variant="primary" size="md">
                <span>Explore the project</span>
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {clients.map((client, idx) => (
              <article
                key={client.slug}
                className="w-[84vw] sm:w-[76vw] max-w-[460px] shrink-0 snap-start p-6 rounded-2xl bg-card border border-line flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-meta tabular-nums shrink-0">
                      {formatCounter(idx, count)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-elevated border border-line font-mono text-[11px] uppercase tracking-wider text-accent font-semibold truncate">
                      {client.industry}
                    </span>
                  </div>

                  <ClientMediaTile client={client} variant="mobile" />

                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-2xl text-ink tracking-tight leading-snug">
                      {client.client}
                    </h3>
                    <p className="text-sm text-soft leading-relaxed line-clamp-3">
                      {client.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <Button href={`/projects/${client.slug}`} variant="primary" size="md">
                    <span>Explore the project</span>
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Centered Secondary Button */}
      <div className="mt-12 flex justify-center">
        <Button href="/projects" variant="secondary" size="md">
          <span>{viewAllLabel}</span>
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
