'use client';

import React, { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useMotion } from '@/components/motion/MotionProvider';
import { SERVICES_DATA } from '@/lib/services-data';
import { siteConfig } from '@/site.config';
import {
  ServiceIconKey,
  ServiceShowcaseCard,
  ShowcaseServiceItem,
} from './ServiceShowcaseCard';

export const TILT_CONFIG = {
  ROT_MAX: 14,
  SCALE_DROP: 0.11,
  OPACITY_DROP: 0.38,
  FALLOFF: 1.8,
  PERSPECTIVE: 1100,
} as const;

export interface CardTiltValues {
  t: number;
  rotateY: number;
  scale: number;
  opacity: number;
}

export function computeCardTilt(
  cardCenterX: number,
  viewportCenterX: number,
  cardPitch: number
): CardTiltValues {
  const delta = cardCenterX - viewportCenterX;
  const sign = delta >= 0 ? 1 : -1;
  const safePitch = Math.max(1, cardPitch);
  const rawT = Math.abs(delta) / (TILT_CONFIG.FALLOFF * safePitch);
  const t = Math.min(1, Math.max(0, rawT));

  const rotateY =
    Math.abs(delta) < 0.5 ? 0 : -sign * TILT_CONFIG.ROT_MAX * t;
  const scale = 1 - TILT_CONFIG.SCALE_DROP * t;
  const opacity = 1 - TILT_CONFIG.OPACITY_DROP * t;

  return { t, rotateY, scale, opacity };
}

type FilterGroupId = 'all' | 'attract' | 'engage' | 'convert' | 'optimize';

// TODO(CONTENT): confirm canonical short CTA labels ({short name}) for each service
const SHORT_SERVICE_NAMES: Record<string, string> = {
  'social-media-marketing': 'Social Media',
  seo: 'SEO',
  'performance-marketing': 'Paid Ads',
  'content-marketing': 'Content',
  'branding-creative': 'Branding',
  'web-design-development': 'Web Dev',
  'email-marketing': 'Email',
  'reputation-management': 'ORM',
  'analytics-audit': 'Analytics',
  'growth-consulting': 'Strategy',
};

const VALID_ICONS: ReadonlySet<string> = new Set([
  'leaf',
  'trending-up',
  'megaphone',
  'pen-tool',
  'compass',
  'layout',
  'mail',
  'shield',
  'activity',
]);

function toServiceIconKey(rawIcon: string): ServiceIconKey {
  return VALID_ICONS.has(rawIcon) ? (rawIcon as ServiceIconKey) : 'compass';
}

// TODO(CONTENT): confirm dedicated 3 showcase bullets per service (currently derived from subServices[0..2].title)
const SHOWCASE_SERVICES: ShowcaseServiceItem[] = siteConfig.serviceGroups.flatMap(
  (group) =>
    group.services.flatMap((configService) => {
      const detail = SERVICES_DATA[configService.slug];
      if (!detail) return [];

      const bullets: [string, string, string] = [
        detail.subServices[0]?.title ?? detail.deliverables[0] ?? 'Discovery & Audit',
        detail.subServices[1]?.title ?? detail.deliverables[1] ?? 'Execution System',
        detail.subServices[2]?.title ?? detail.deliverables[2] ?? 'Measurement & Reporting',
      ];

      return [
        {
          slug: detail.slug,
          name: detail.name,
          shortName: SHORT_SERVICE_NAMES[detail.slug] ?? detail.name,
          groupId: detail.groupId,
          groupName: detail.groupName,
          groupNumber: detail.groupNumber,
          icon: toServiceIconKey(configService.icon),
          promise: detail.oneLineOutcome,
          bullets,
        },
      ];
    })
);

interface ServicesShowcaseProps {
  pinned?: boolean;
  eyebrow?: string;
  title?: React.ReactNode;
  copy?: string;
  sectionId?: string;
  tone?: 'base' | 'alt';
}

export function ServicesShowcase({
  pinned = true,
  eyebrow = 'WHAT WE DO',
  title = (
    <>
      Complete growth solutions, <span className="font-italic-accent">connected.</span>
    </>
  ),
  copy = 'Four strategic disciplines working in synergy to acquire, engage, convert, and scale your audience.',
  sectionId = 'services-selector',
  tone = 'alt',
}: ServicesShowcaseProps) {
  const { reduced, lenis } = useMotion();

  const [activeGroup, setActiveGroup] = useState<FilterGroupId>('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const activeIndexRef = useRef(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const snapPointsRef = useRef<number[]>([0]);
  const pendingScrollResetRef = useRef(false);
  const pendingFilterAnimateInRef = useRef(false);
  const isFilteringRef = useRef(false);

  const filterOptions = useMemo(
    () => [
      { id: 'all' as const, label: 'All' },
      ...siteConfig.serviceGroups.map((group) => ({
        id: group.id as FilterGroupId,
        label: group.name,
      })),
    ],
    []
  );

  const filteredServices = useMemo(() => {
    if (activeGroup === 'all') return SHOWCASE_SERVICES;
    return SHOWCASE_SERVICES.filter((service) => service.groupId === activeGroup);
  }, [activeGroup]);

  // Desktop GSAP ScrollTrigger horizontal pin + exact perspective(1100px) rotateY/scale/opacity model
  // Never runs below 1024px, on touch devices, or when prefers-reduced-motion is active.
  useGSAP(
    () => {
      if (!pinned || reduced) {
        scrollTriggerRef.current = null;
        return;
      }

      const mm = gsap.matchMedia();
      let fontsCancelled = false;

      mm.add(
        '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const stageEl = stageRef.current;
          const viewportEl = viewportRef.current;
          const trackEl = trackRef.current;
          const hintEl = scrollHintRef.current;
          if (!stageEl || !viewportEl || !trackEl) return;

          const itemEls = itemRefs.current
            .slice(0, filteredServices.length)
            .filter((el): el is HTMLLIElement => el !== null);
          const wrapEls = wrapperRefs.current
            .slice(0, filteredServices.length)
            .filter((el): el is HTMLDivElement => el !== null);
          const cardEls = cardRefs.current
            .slice(0, filteredServices.length)
            .filter((el): el is HTMLElement => el !== null);

          if (itemEls.length === 0 || wrapEls.length !== itemEls.length) return;

          let maxScroll = 0;
          let dwellScroll = 0;
          let moveFraction = 1;
          let viewportCenterX = 0;
          let cardPitch = 384;
          let cardCenters: number[] = [];
          let snapPoints: number[] = [0];

          const measureLayout = () => {
            const vpWidth = viewportEl.clientWidth;
            viewportCenterX = vpWidth / 2;
            cardCenters = itemEls.map((el) => el.offsetLeft + el.offsetWidth / 2);

            if (cardCenters.length > 1) {
              cardPitch = Math.max(240, Math.abs(cardCenters[1] - cardCenters[0]));
            } else {
              cardPitch = Math.max(240, itemEls[0].offsetWidth);
            }

            maxScroll = Math.max(0, trackEl.scrollWidth - vpWidth);
            dwellScroll =
              maxScroll > 0 ? Math.round(Math.min(260, cardPitch * 0.6)) : 0;
            const totalTravel = maxScroll + dwellScroll;
            moveFraction = totalTravel > 0 ? maxScroll / totalTravel : 1;

            if (maxScroll > 0 && cardCenters.length > 1) {
              snapPoints = cardCenters.map((center) => {
                const trackRatio = gsap.utils.clamp(
                  0,
                  1,
                  (center - viewportCenterX) / maxScroll
                );
                return trackRatio * moveFraction;
              });
              snapPoints[0] = 0;
              snapPoints[snapPoints.length - 1] = moveFraction;
            } else {
              snapPoints = [0];
            }

            snapPointsRef.current = snapPoints;
          };

          const setTrackX = gsap.quickSetter(trackEl, 'x', 'px');
          const setHintOpacity = hintEl
            ? gsap.quickSetter(hintEl, 'opacity')
            : null;
          const wrapperSetters = wrapEls.map((el) => ({
            transform: gsap.quickSetter(el, 'transform'),
            opacity: gsap.quickSetter(el, 'opacity'),
          }));

          const syncActiveAttribute = (nextIdx: number) => {
            for (let i = 0; i < cardEls.length; i++) {
              cardEls[i].setAttribute(
                'data-active',
                i === nextIdx ? 'true' : 'false'
              );
            }
          };

          const applyScrollState = (progress: number) => {
            const trackProgress =
              moveFraction > 0
                ? Math.min(1, Math.max(0, progress / moveFraction))
                : 1;
            const trackX = -trackProgress * maxScroll;
            setTrackX(trackX);

            if (setHintOpacity) {
              setHintOpacity(gsap.utils.clamp(0, 1, 1 - progress / 0.05));
            }

            let closestIdx = 0;
            let closestDist = Infinity;

            for (let i = 0; i < wrapEls.length; i++) {
              const currentCenterX = (cardCenters[i] ?? 0) + trackX;
              const dist = Math.abs(currentCenterX - viewportCenterX);
              if (dist < closestDist) {
                closestDist = dist;
                closestIdx = i;
              }

              const { rotateY, scale, opacity } = computeCardTilt(
                currentCenterX,
                viewportCenterX,
                cardPitch
              );

              const setter = wrapperSetters[i];
              setter.transform(
                `perspective(${TILT_CONFIG.PERSPECTIVE}px) rotateY(${rotateY}deg) scale(${scale})`
              );
              setter.opacity(opacity);
            }

            if (closestIdx !== activeIndexRef.current) {
              activeIndexRef.current = closestIdx;
              syncActiveAttribute(closestIdx);
              setActiveIndex(closestIdx);
            }
          };

          const setWillChange = (enabled: boolean) => {
            trackEl.style.willChange = enabled ? 'transform' : 'auto';
            for (const el of wrapEls) {
              el.style.willChange = enabled ? 'transform, opacity' : 'auto';
            }
          };

          measureLayout();
          syncActiveAttribute(0);
          gsap.set(trackEl, { x: 0 });
          applyScrollState(0);

          const scrubState = { progress: 0 };
          const scrubTween = gsap.to(scrubState, {
            progress: 1,
            ease: 'none',
            onUpdate: () => {
              applyScrollState(scrubState.progress);
            },
            scrollTrigger: {
              trigger: stageEl,
              start: 'top top+=80',
              end: () => {
                measureLayout();
                const totalTravel = maxScroll + dwellScroll;
                if (totalTravel <= 0) return '+=1';
                // Track overflow + end dwell, capped cleanly at 4 viewport heights
                const cappedDistance = Math.min(
                  totalTravel,
                  Math.round(window.innerHeight * 4)
                );
                return `+=${Math.max(200, cappedDistance)}`;
              },
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              snap:
                itemEls.length > 1
                  ? {
                      snapTo: (value) => {
                        if (snapPoints.length <= 1) return 0;
                        // Allow clean release through the end dwell after the final card centers
                        if (value >= moveFraction) return value;
                        return gsap.utils.snap(snapPoints, value);
                      },
                      duration: { min: 0.15, max: 0.35 },
                      delay: 0.06,
                      ease: 'power2.out',
                    }
                  : undefined,
              onRefresh: () => {
                measureLayout();
                applyScrollState(scrubState.progress);
              },
              onToggle: (self) => {
                setWillChange(self.isActive);
              },
            },
          });

          const st = scrubTween.scrollTrigger ?? null;
          scrollTriggerRef.current = st;
          ScrollTrigger.refresh();

          if (pendingScrollResetRef.current && st) {
            pendingScrollResetRef.current = false;
            const targetTop = st.start;
            if (Math.abs(window.scrollY - targetTop) > 4) {
              if (lenis) {
                lenis.resize();
                lenis.scrollTo(targetTop, { immediate: true, force: true });
              } else {
                window.scrollTo({ top: targetTop, behavior: 'auto' });
              }
            }
          }

          if (pendingFilterAnimateInRef.current) {
            pendingFilterAnimateInRef.current = false;
            gsap.fromTo(
              trackEl,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.22,
                ease: 'power2.out',
                clearProps: 'opacity',
              }
            );
          }

          if (typeof document !== 'undefined' && document.fonts?.ready) {
            document.fonts.ready.then(() => {
              if (!fontsCancelled) {
                ScrollTrigger.refresh();
              }
            });
          }

          return () => {
            fontsCancelled = true;
            setWillChange(false);
            scrollTriggerRef.current = null;
            scrubTween.kill();
          };
        }
      );

      return () => {
        fontsCancelled = true;
        mm.revert();
      };
    },
    {
      scope: sectionRef,
      dependencies: [activeGroup, pinned, reduced],
      revertOnUpdate: true,
    }
  );

  // Desktop keyboard focus: bring focused card to center using Lenis when active or window.scrollTo
  const handleCardFocus = (index: number) => {
    const st = scrollTriggerRef.current;
    if (!st || !pinned || reduced) return;

    const points = snapPointsRef.current;
    const targetProgress = points[index] ?? 0;
    const targetScrollY = st.start + targetProgress * (st.end - st.start);

    if (Math.abs(window.scrollY - targetScrollY) > 6) {
      if (lenis) {
        lenis.scrollTo(targetScrollY, { duration: 0.45 });
      } else {
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      }
    }
  };

  // ArrowLeft / ArrowRight navigation across cards in DOM order
  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    index: number
  ) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= filteredServices.length) return;

    event.preventDefault();
    const targetCard = itemRefs.current[nextIndex];
    const focusTarget = targetCard?.querySelector<HTMLElement>('a[href], button');
    focusTarget?.focus();
  };

  // Filter change: fade/swap cleanly on desktop with ScrollTrigger rebuild; instant scroll reset on mobile/reduced
  const handleFilterChange = (nextGroup: FilterGroupId) => {
    if (nextGroup === activeGroup || isFilteringRef.current) return;

    const swapGroup = () => {
      activeIndexRef.current = 0;
      setActiveIndex(0);
      setActiveGroup(nextGroup);
      if (viewportRef.current) {
        viewportRef.current.scrollLeft = 0;
      }
      isFilteringRef.current = false;
    };

    const st = scrollTriggerRef.current;
    const trackEl = trackRef.current;
    const isDesktopAnimated =
      pinned &&
      !reduced &&
      st !== null &&
      trackEl !== null &&
      typeof window !== 'undefined' &&
      window.matchMedia(
        '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
      ).matches;

    if (!isDesktopAnimated) {
      swapGroup();
      return;
    }

    isFilteringRef.current = true;
    pendingScrollResetRef.current = true;
    pendingFilterAnimateInRef.current = true;

    gsap.to(trackEl, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      overwrite: true,
      onComplete: swapGroup,
    });
  };

  const countLabel = `${filteredServices.length} ${
    filteredServices.length === 1 ? 'service' : 'services'
  } shown`;

  const useDesktopPinnedLayout = pinned && !reduced;

  return (
    <Section
      id={sectionId}
      ref={sectionRef}
      tone={tone}
      spacing="none"
      className="overflow-x-clip"
    >
      <div
        ref={stageRef}
        className={
          useDesktopPinnedLayout
            ? 'py-14 md:py-20 lg:py-[clamp(14px,2vh,28px)] lg:[height:calc(100vh-80px)] lg:supports-[height:100svh]:[height:calc(100svh-80px)] lg:flex lg:flex-col lg:justify-between lg:gap-[clamp(10px,1.4vh,18px)]'
            : 'py-14 md:py-20 lg:py-24 flex flex-col gap-6'
        }
      >
        {/* Compact Header Block & Centered Filter Row */}
        <Container className="shrink-0">
          <div className="flex flex-col gap-[clamp(10px,1.5vh,18px)]">
            <SectionHeading
              size="compact"
              eyebrow={eyebrow}
              title={title}
              copy={copy}
            />

            {/* Filter Pills + Inline Desktop NN / TT Counter (centered) */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div
                role="group"
                aria-label="Filter services by discipline"
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {filterOptions.map((option) => {
                  const isSelected = activeGroup === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleFilterChange(option.id)}
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full border font-mono text-[11px] uppercase tracking-wider cursor-pointer ${
                        reduced ? '' : 'transition-colors duration-200'
                      } ${
                        isSelected
                          ? 'bg-accent text-canvas border-accent-hi font-semibold'
                          : 'bg-elevated text-soft border-line hover:border-line-strong hover:text-ink'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {useDesktopPinnedLayout && (
                <div
                  className="hidden lg:inline-flex items-center pl-2 border-l border-line font-mono text-xs text-meta tabular-nums"
                  aria-hidden="true"
                >
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(filteredServices.length).padStart(2, '0')}
                </div>
              )}
            </div>

            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {countLabel}
            </div>
          </div>
        </Container>

        {/* Card Track Viewport (CSS scroll-snap on mobile & reduced motion; GSAP horizontal track on desktop) */}
        <div
          ref={viewportRef}
          className={`w-full overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            useDesktopPinnedLayout
              ? 'lg:flex-1 lg:min-h-0 lg:flex lg:items-center lg:overflow-visible lg:snap-none'
              : ''
          }`}
        >
          <ul
            ref={trackRef}
            aria-label="Digital growth services"
            className={`flex flex-row items-stretch gap-4 sm:gap-5 px-4 sm:px-6 py-3 list-none ${
              useDesktopPinnedLayout
                ? 'lg:w-max lg:px-[calc(50vw-175px)] xl:px-[calc(50vw-190px)]'
                : 'mx-auto w-max lg:px-8'
            }`}
          >
            {filteredServices.map((service, idx) => {
              const isActive = idx === activeIndex;
              const displayIndex = String(idx + 1).padStart(2, '0');

              return (
                <li
                  key={service.slug}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onKeyDown={(e) => handleCardKeyDown(e, idx)}
                  className={
                    useDesktopPinnedLayout
                      ? 'w-[82vw] max-w-[330px] sm:w-[340px] lg:w-[350px] xl:w-[380px] lg:h-[clamp(320px,49svh,420px)] shrink-0 snap-center lg:snap-none'
                      : 'w-[82vw] max-w-[330px] sm:w-[340px] shrink-0 snap-center'
                  }
                >
                  <div
                    ref={(el) => {
                      wrapperRefs.current[idx] = el;
                    }}
                    className="h-full"
                  >
                    <ServiceShowcaseCard
                      service={service}
                      displayIndex={displayIndex}
                      isActive={isActive}
                      reduced={reduced}
                      cardRef={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      onCardFocus={() => handleCardFocus(idx)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Scroll Hint (fades out once progress passes ~5%) */}
        {useDesktopPinnedLayout && (
          <div
            ref={scrollHintRef}
            aria-hidden="true"
            className="hidden lg:flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-widest text-meta shrink-0 pb-1"
          >
            <span>Scroll to explore</span>
            <ArrowDown size={13} className="text-accent" />
          </div>
        )}
      </div>
    </Section>
  );
}
