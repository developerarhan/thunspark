import React from 'react';
import Image from 'next/image';

export interface ThunSparkLogoProps {
  size?: number; // width/height of the mark in px, default 24
  showText?: boolean; // whether to show "THUNSPARK" text lockup
  className?: string;
  textClassName?: string;
}

export function ThunSparkLogo({
  size = 24,
  showText = true,
  className = '',
  textClassName = '',
}: ThunSparkLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Brand Icon Badge */}
      <div
        className="relative rounded-lg overflow-hidden shrink-0 border border-line/60 bg-[#121214] shadow-xs group-hover:border-accent/60 transition-colors"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo.jpg"
          alt="ThunSpark Logo"
          width={size * 2}
          height={size * 2}
          className="w-full h-full object-cover select-none"
          priority
        />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <span
          className={`font-display font-extrabold tracking-tight text-ink ${
            textClassName || 'text-sm sm:text-base md:text-xl'
          }`}
        >
          THUN<span className="text-accent">SPARK</span>
        </span>
      )}
    </div>
  );
}
