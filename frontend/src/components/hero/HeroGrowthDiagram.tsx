'use client';

import React from 'react';

/**
 * Architectural SVG diagram illustrating:
 * - Left: The Bottleneck (constricted choked channel)
 * - Center: The System (4 connected nodes: Attract, Engage, Convert, Optimize)
 * - Right: The Breakthrough (ascending line opening out into scalable momentum)
 *
 * Rules:
 * - Tokens only (canvas, line, line-strong, soft, accent).
 * - No numbers, metrics, logos, or claims.
 * - Single CSS stroke draw-in on mount (400ms delay, <= 1.2s duration).
 * - "Thunder-Circuit" animation:
 *   1. Continuous electric dash-flow on all circuit paths (3s linear infinite).
 *   2. Subtle breathing pulse on the OPTIMIZE node and Breakthrough arrow (2.5s ease-in-out infinite).
 *   3. Electric/accent glow on the OPTIMIZE node and Breakthrough arrow.
 *   4. Prefers-reduced-motion renders static immediately with zero motion/filters.
 */
export function HeroGrowthDiagram() {
  return (
    <div className="w-full max-w-xl aspect-[540/340] rounded-2xl border border-line bg-card/40 p-4 sm:p-6 lg:p-7 flex items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-sm">
      <style>{`
        /* One-time initial mount draw-in */
        @keyframes heroStrokeDraw {
          from {
            stroke-dashoffset: 800;
            opacity: 0.15;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes heroNodeFade {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hero-draw-path {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: heroStrokeDraw 1.2s cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards;
        }
        .hero-node-item {
          opacity: 0;
          transform-origin: center;
          animation: heroNodeFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) 650ms forwards;
        }

        /* Continuous Electric Dash Flow (3s linear infinite) */
        @keyframes circuitFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -24;
          }
        }
        .circuit-flow {
          stroke-dasharray: 6 6;
          animation: circuitFlow 3s linear infinite;
        }
        .circuit-flow-accent {
          stroke-dasharray: 6 6;
          animation: circuitFlow 3s linear infinite;
          filter: drop-shadow(0 0 3px rgba(255, 210, 31, 0.45));
        }

        /* Electric pulse traveling along the primary breakthrough trajectory */
        @keyframes breakthroughPulse {
          0% {
            stroke-dashoffset: 200;
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          85% {
            opacity: 0.95;
          }
          100% {
            stroke-dashoffset: -30;
            opacity: 0;
          }
        }
        .circuit-pulse-breakthrough {
          stroke-dasharray: 32 200;
          animation: breakthroughPulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          filter: drop-shadow(0 0 4px rgba(255, 210, 31, 0.9));
        }

        /* Subtle Breathing Pulse + Electric Accent Glow (2.5s ease-in-out infinite) */
        @keyframes pulseGlowOptimize {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 2px rgba(255, 210, 31, 0.35));
          }
          50% {
            transform: scale(1.06);
            filter: drop-shadow(0 0 8px rgba(255, 210, 31, 0.8)) drop-shadow(0 0 16px rgba(255, 210, 31, 0.35));
          }
        }
        .hero-pulse-optimize {
          animation: pulseGlowOptimize 2.5s ease-in-out infinite;
        }

        @keyframes pulseGlowArrow {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 2px rgba(255, 210, 31, 0.4));
          }
          50% {
            transform: scale(1.1);
            filter: drop-shadow(0 0 9px rgba(255, 210, 31, 0.9)) drop-shadow(0 0 16px rgba(255, 210, 31, 0.4));
          }
        }
        .hero-pulse-arrow {
          animation: pulseGlowArrow 2.5s ease-in-out infinite;
        }

        @keyframes pulseGlowTrajectory {
          0%, 100% {
            filter: drop-shadow(0 0 1px rgba(255, 210, 31, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 5px rgba(255, 210, 31, 0.65));
          }
        }
        .hero-pulse-trajectory {
          animation: pulseGlowTrajectory 2.5s ease-in-out infinite;
        }

        /* Prefers-reduced-motion: All continuous animations, pulses, and filters disabled */
        @media (prefers-reduced-motion: reduce) {
          .hero-draw-path,
          .hero-node-item,
          .circuit-flow,
          .circuit-flow-accent,
          .circuit-pulse-breakthrough,
          .hero-pulse-optimize,
          .hero-pulse-arrow,
          .hero-pulse-trajectory {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          .circuit-pulse-breakthrough {
            display: none !important;
          }
        }
      `}</style>

      <svg
        role="img"
        aria-labelledby="hero-diagram-title hero-diagram-desc"
        viewBox="0 0 540 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto select-none"
      >
        <title id="hero-diagram-title">Bottleneck, System, Breakthrough Growth Architecture</title>
        <desc id="hero-diagram-desc">
          A strategic diagram demonstrating how constricted growth channels are restructured through four connected disciplines into an ascending breakthrough trajectory.
        </desc>

        {/* ======================================================== */}
        {/* PHASE GUIDELINES & LABELS                                */}
        {/* ======================================================== */}
        <line
          x1="150"
          y1="35"
          x2="150"
          y2="305"
          stroke="var(--color-line, #252525)"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
        <line
          x1="370"
          y1="35"
          x2="370"
          y2="305"
          stroke="var(--color-line, #252525)"
          strokeDasharray="3 4"
          strokeWidth="1"
        />

        <text
          x="85"
          y="36"
          textAnchor="middle"
          fill="var(--color-soft, #8A8A85)"
          fontFamily="monospace"
          fontSize="10"
          letterSpacing="0.16em"
          className="uppercase"
        >
          Bottleneck
        </text>

        <text
          x="260"
          y="36"
          textAnchor="middle"
          fill="var(--color-soft, #8A8A85)"
          fontFamily="monospace"
          fontSize="10"
          letterSpacing="0.16em"
          className="uppercase"
        >
          Connected System
        </text>

        <text
          x="445"
          y="36"
          textAnchor="middle"
          fill="var(--color-accent, #FFD21F)"
          fontFamily="monospace"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.16em"
          className="uppercase"
        >
          Breakthrough
        </text>

        {/* ======================================================== */}
        {/* PHASE 1: BOTTLENECK (Narrow Constricted Channels)         */}
        {/* ======================================================== */}
        {/* Funnel Envelope Bounds */}
        <path
          d="M 25 105 C 75 105, 115 156, 145 162"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.5"
          className="hero-draw-path"
        />
        <path
          d="M 25 235 C 75 235, 115 184, 145 178"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.5"
          className="hero-draw-path"
        />

        {/* Trajectory Streams Constricting into Throat */}
        <path
          d="M 25 130 C 70 130, 110 166, 145 167"
          stroke="var(--color-line, #252525)"
          strokeWidth="1.2"
          className="hero-draw-path"
        />
        <path
          d="M 25 170 L 145 170"
          stroke="var(--color-line, #252525)"
          strokeWidth="1.2"
          className="hero-draw-path"
        />
        <path
          d="M 25 210 C 70 210, 110 174, 145 173"
          stroke="var(--color-line, #252525)"
          strokeWidth="1.2"
          className="hero-draw-path"
        />

        {/* Constriction Throat Bracket Indicator */}
        <line
          x1="145"
          y1="162"
          x2="145"
          y2="178"
          stroke="var(--color-accent, #FFD21F)"
          strokeWidth="2"
          className="hero-draw-path"
        />

        {/* ======================================================== */}
        {/* PHASE 2: CONNECTED SYSTEM (4 Interconnected Nodes)        */}
        {/* ======================================================== */}
        {/* Feed Channels from Throat into System */}
        <path
          d="M 145 170 C 175 170, 185 115, 210 115"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.5"
          className="hero-draw-path"
        />
        <path
          d="M 145 170 C 175 170, 185 225, 210 225"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.5"
          className="hero-draw-path"
        />

        {/* System Interconnect Circuit Lines */}
        <path
          d="M 210 115 L 310 115"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.5"
          className="hero-draw-path"
        />
        <path
          d="M 210 225 L 310 225"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.5"
          className="hero-draw-path"
        />
        {/* Vertical and Diagonal Circuit Interconnects with continuous dash-flow */}
        <path
          d="M 210 115 L 210 225"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.2"
          className="circuit-flow"
        />
        <path
          d="M 310 115 L 310 225"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.2"
          className="circuit-flow"
        />
        <path
          d="M 210 115 L 310 225"
          stroke="var(--color-line, #252525)"
          strokeWidth="1"
          className="circuit-flow"
        />
        <path
          d="M 210 225 L 310 115"
          stroke="var(--color-line, #252525)"
          strokeWidth="1"
          className="circuit-flow"
        />

        {/* NODE 1: ATTRACT (Standard Node) */}
        <g className="hero-node-item">
          <circle
            cx="210"
            cy="115"
            r="15"
            fill="var(--color-card, #111111)"
            stroke="var(--color-line-strong, #353535)"
            strokeWidth="1.5"
          />
          <circle cx="210" cy="115" r="3.5" fill="var(--color-soft, #8A8A85)" />
          <text
            x="210"
            y="88"
            textAnchor="middle"
            fill="var(--color-soft, #A6A6A0)"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="500"
            letterSpacing="0.08em"
          >
            ATTRACT
          </text>
        </g>

        {/* NODE 2: ENGAGE (Standard Node) */}
        <g className="hero-node-item">
          <circle
            cx="210"
            cy="225"
            r="15"
            fill="var(--color-card, #111111)"
            stroke="var(--color-line-strong, #353535)"
            strokeWidth="1.5"
          />
          <circle cx="210" cy="225" r="3.5" fill="var(--color-soft, #8A8A85)" />
          <text
            x="210"
            y="262"
            textAnchor="middle"
            fill="var(--color-soft, #A6A6A0)"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="500"
            letterSpacing="0.08em"
          >
            ENGAGE
          </text>
        </g>

        {/* NODE 3: CONVERT (Standard Node) */}
        <g className="hero-node-item">
          <circle
            cx="310"
            cy="115"
            r="15"
            fill="var(--color-card, #111111)"
            stroke="var(--color-line-strong, #353535)"
            strokeWidth="1.5"
          />
          <circle cx="310" cy="115" r="3.5" fill="var(--color-soft, #8A8A85)" />
          <text
            x="310"
            y="88"
            textAnchor="middle"
            fill="var(--color-soft, #A6A6A0)"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="500"
            letterSpacing="0.08em"
          >
            CONVERT
          </text>
        </g>

        {/* NODE 4: OPTIMIZE (Accent Node with Breathing Pulse & Electric Glow) */}
        <g className="hero-node-item">
          <g className="hero-pulse-optimize" style={{ transformOrigin: '310px 225px' }}>
            <circle
              cx="310"
              cy="225"
              r="16"
              fill="var(--color-canvas, #050505)"
              stroke="var(--color-accent, #FFD21F)"
              strokeWidth="2"
            />
            <circle cx="310" cy="225" r="4.5" fill="var(--color-accent, #FFD21F)" />
          </g>
          <text
            x="310"
            y="262"
            textAnchor="middle"
            fill="var(--color-accent, #FFD21F)"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            OPTIMIZE
          </text>
        </g>

        {/* ======================================================== */}
        {/* PHASE 3: BREAKTHROUGH (Ascending Escalation Vector)       */}
        {/* ======================================================== */}
        {/* System Convergence to Launch Vector */}
        <path
          d="M 310 115 C 335 115, 345 170, 360 170"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.5"
          className="hero-draw-path"
        />
        <path
          d="M 310 225 C 335 225, 345 170, 360 170"
          stroke="var(--color-accent, #FFD21F)"
          strokeWidth="1.5"
          className="circuit-flow-accent"
        />

        {/* Expansion Envelope Outlines */}
        <path
          d="M 360 155 C 410 145, 455 75, 515 65"
          stroke="var(--color-line, #252525)"
          strokeWidth="1.2"
          className="hero-draw-path"
        />
        <path
          d="M 360 185 C 410 195, 455 265, 515 275"
          stroke="var(--color-line, #252525)"
          strokeWidth="1.2"
          className="hero-draw-path"
        />

        {/* Supporting Momentum Rays with Dash-Flow */}
        <path
          d="M 360 170 C 410 170, 445 130, 505 120"
          stroke="var(--color-line-strong, #353535)"
          strokeWidth="1.2"
          className="circuit-flow"
        />
        <path
          d="M 360 170 C 410 170, 445 200, 505 210"
          stroke="var(--color-line, #252525)"
          strokeWidth="1"
          className="circuit-flow"
        />

        {/* PRIMARY BREAKTHROUGH ASCENDING TRAJECTORY (Accent with subtle glow) */}
        <path
          d="M 360 170 C 400 170, 440 105, 505 82"
          stroke="var(--color-accent, #FFD21F)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="hero-draw-path hero-pulse-trajectory"
        />

        {/* Overlaid Electric Pulse traveling along the trajectory */}
        <path
          d="M 360 170 C 400 170, 440 105, 505 82"
          stroke="#FFF2A3"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="circuit-pulse-breakthrough"
        />

        {/* Terminal Breakthrough Arrow Head at (505, 82) with Breathing Pulse & Glow */}
        <g className="hero-node-item">
          <g className="hero-pulse-arrow" style={{ transformOrigin: '505px 82px' }}>
            <polygon
              points="496,75 512,80 504,95 502,86 493,83"
              fill="var(--color-accent, #FFD21F)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
