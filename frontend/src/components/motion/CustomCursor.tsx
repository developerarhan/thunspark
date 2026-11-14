'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorState {
  isInteractive: boolean;
  label?: string;
}

function resolveInteractiveTarget(
  target: EventTarget | null,
  clientX: number,
  clientY: number
): CursorState {
  let element: Element | null = null;

  if (target instanceof Element) {
    element = target;
  } else if (target instanceof Node) {
    element = target.parentElement;
  }

  // Fallback to coordinates if target unmounted mid-interaction
  if (!element || !element.isConnected) {
    element = document.elementFromPoint(clientX, clientY);
  }

  if (!element || !element.isConnected) {
    return { isInteractive: false };
  }

  // 1. Elements with custom badge text (e.g. data-cursor="VIEW")
  const customCursorEl = element.closest('[data-cursor]');
  if (customCursorEl) {
    const label = customCursorEl.getAttribute('data-cursor')?.trim();
    if (label) {
      return { isInteractive: true, label };
    }
  }

  // 2. Standard interactive targets (links, buttons, inputs, dropdowns)
  const interactiveEl = element.closest(
    'a, button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
  );
  if (interactiveEl) {
    return { isInteractive: true };
  }

  return { isInteractive: false };
}

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<CursorState>({
    isInteractive: false,
  });
  const [isVisible, setIsVisible] = useState(false);

  const isVisibleRef = useRef(false);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncVisibility = (visible: boolean) => {
      if (isVisibleRef.current !== visible) {
        isVisibleRef.current = visible;
        setIsVisible(visible);
      }
    };

    const resetState = () => {
      setCursorState((prev) =>
        prev.isInteractive || prev.label ? { isInteractive: false } : prev
      );
    };

    const updateFromTarget = (
      target: EventTarget | null,
      clientX: number,
      clientY: number
    ) => {
      const nextState = resolveInteractiveTarget(target, clientX, clientY);
      setCursorState((prev) =>
        prev.isInteractive === nextState.isInteractive && prev.label === nextState.label
          ? prev
          : nextState
      );
    };

    const isEnabled = () => finePointerQuery.matches && !reducedMotionQuery.matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled()) return;

      posRef.current = { x: e.clientX, y: e.clientY };
      setPos(posRef.current);
      syncVisibility(true);
      updateFromTarget(e.target, e.clientX, e.clientY);
    };

    const handlePointerReset = () => {
      resetState();
    };

    const handleScroll = () => {
      if (!isVisibleRef.current || !isEnabled()) return;
      const { x, y } = posRef.current;
      updateFromTarget(document.elementFromPoint(x, y), x, y);
    };

    const handleMouseLeave = () => {
      syncVisibility(false);
      resetState();
    };

    const handleCapabilityChange = () => {
      if (!isEnabled()) {
        syncVisibility(false);
        resetState();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handlePointerReset, { passive: true });
    window.addEventListener('click', handlePointerReset, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', handlePointerReset);
    document.addEventListener('mouseleave', handleMouseLeave);
    finePointerQuery.addEventListener('change', handleCapabilityChange);
    reducedMotionQuery.addEventListener('change', handleCapabilityChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handlePointerReset);
      window.removeEventListener('click', handlePointerReset);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePointerReset);
      document.removeEventListener('mouseleave', handleMouseLeave);
      finePointerQuery.removeEventListener('change', handleCapabilityChange);
      reducedMotionQuery.removeEventListener('change', handleCapabilityChange);
    };
  }, []);

  if (!isVisible) return null;

  // On standard interactive targets (buttons & links without a custom badge label),
  // hide the custom cursor completely so clean native pointer & button hover effects take over.
  const isOverStandardInteractive = cursorState.isInteractive && !cursorState.label;
  const isOverBadgeInteractive = cursorState.isInteractive && Boolean(cursorState.label);

  return (
    <>
      {/* Precision Center Dot (hides on interactive buttons/links) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: isOverStandardInteractive ? 0 : 1,
          opacity: isOverStandardInteractive ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Outer Ring / Badge:
          - Idle: subtle 32px hollow accent ring
          - On standard buttons/links: completely scales to 0 & hides so native cursor works without occlusion
          - On badge targets (e.g. data-cursor="VIEW"): smoothly displays the filled label badge
      */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 flex items-center justify-center font-mono text-[9px] font-bold tracking-widest uppercase border"
        animate={{
          x: pos.x - (isOverBadgeInteractive ? 36 : 16),
          y: pos.y - (isOverBadgeInteractive ? 36 : 16),
          width: isOverBadgeInteractive ? 72 : 32,
          height: isOverBadgeInteractive ? 72 : 32,
          scale: isOverStandardInteractive ? 0 : 1,
          opacity: isOverStandardInteractive ? 0 : 1,
          backgroundColor: isOverBadgeInteractive ? '#FFD21F' : 'transparent',
          borderColor: isOverBadgeInteractive ? '#FFE75A' : 'rgba(255, 210, 31, 0.4)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 320, mass: 0.15 }}
      >
        {isOverBadgeInteractive && cursorState.label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center font-bold px-1 text-canvas"
          >
            {cursorState.label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
