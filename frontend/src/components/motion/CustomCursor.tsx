'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorHoverState {
  isHovered: boolean;
  label?: string;
}

function resolveInteractiveTarget(
  target: EventTarget | null,
  clientX: number,
  clientY: number
): Element | null {
  let element: Element | null = null;

  if (target instanceof Element) {
    element = target;
  } else if (target instanceof Node) {
    element = target.parentElement;
  }

  // Fallback to coordinates if the event target unmounted mid-interaction
  if (!element || !element.isConnected) {
    element = document.elementFromPoint(clientX, clientY);
  }

  return element && element.isConnected
    ? element.closest('[data-cursor], a, button')
    : null;
}

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hoverState, setHoverState] = useState<CursorHoverState>({
    isHovered: false,
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

    const resetHoverState = () => {
      setHoverState((prev) => (prev.isHovered ? { isHovered: false } : prev));
    };

    const updateHoverFromTarget = (
      target: EventTarget | null,
      clientX: number,
      clientY: number
    ) => {
      const interactive = resolveInteractiveTarget(target, clientX, clientY);
      const nextState: CursorHoverState = interactive
        ? {
            isHovered: true,
            label: interactive.getAttribute('data-cursor') || undefined,
          }
        : { isHovered: false };

      setHoverState((prev) =>
        prev.isHovered === nextState.isHovered && prev.label === nextState.label
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
      updateHoverFromTarget(e.target, e.clientX, e.clientY);
    };

    const handlePointerReset = () => {
      resetHoverState();
    };

    const handleScroll = () => {
      if (!isVisibleRef.current || !isEnabled()) return;
      const { x, y } = posRef.current;
      updateHoverFromTarget(document.elementFromPoint(x, y), x, y);
    };

    const handleMouseLeave = () => {
      syncVisibility(false);
      resetHoverState();
    };

    const handleCapabilityChange = () => {
      if (!isEnabled()) {
        syncVisibility(false);
        resetHoverState();
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

  return (
    <>
      {/* Precision Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: hoverState.isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Expanding Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-accent pointer-events-none z-50 flex items-center justify-center font-mono text-[9px] font-bold tracking-widest text-canvas uppercase"
        animate={{
          x: pos.x - (hoverState.isHovered ? (hoverState.label ? 36 : 22) : 16),
          y: pos.y - (hoverState.isHovered ? (hoverState.label ? 36 : 22) : 16),
          width: hoverState.isHovered ? (hoverState.label ? 72 : 44) : 32,
          height: hoverState.isHovered ? (hoverState.label ? 72 : 44) : 32,
          backgroundColor: hoverState.isHovered ? '#FFD21F' : 'rgba(255, 210, 31, 0.05)',
          borderColor: hoverState.isHovered ? '#FFE75A' : '#FFD21F',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.15 }}
      >
        {hoverState.label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center font-bold px-1"
          >
            {hoverState.label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
