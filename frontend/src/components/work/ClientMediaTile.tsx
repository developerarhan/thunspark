import React from 'react';
import Image from 'next/image';
import type { HomeWorkClient } from '@/lib/content/types';

function getClientInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => /[a-z0-9]/i.test(word));

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (name.trim().slice(0, 2) || 'TS').toUpperCase();
}

function isSanityCdnUrl(url: string): boolean {
  return url.startsWith('https://cdn.sanity.io/') || url.startsWith('/');
}

interface ClientMediaTileProps {
  client: HomeWorkClient;
  variant: 'featured' | 'mobile' | 'compact';
}

export function ClientMediaTile({ client, variant }: ClientMediaTileProps) {
  const initials = getClientInitials(client.client);

  if (client.cover) {
    const sizeClasses =
      variant === 'compact'
        ? 'w-14 h-14 rounded-lg'
        : variant === 'mobile'
          ? 'w-full aspect-[16/10] rounded-xl'
          : 'w-full sm:w-56 md:w-64 lg:w-72 aspect-[4/3] rounded-xl';

    const sizes =
      variant === 'compact'
        ? '56px'
        : variant === 'mobile'
          ? '(max-width: 640px) 84vw, 420px'
          : '(max-width: 1024px) 256px, 288px';

    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-elevated border border-line ${sizeClasses}`}
      >
        <Image
          src={client.cover}
          alt={`${client.client} project showcase`}
          fill
          sizes={sizes}
          unoptimized={!isSanityCdnUrl(client.cover)}
          className={`object-contain ${variant === 'compact' ? 'p-1' : 'p-2'}`}
        />
      </div>
    );
  }

  if (client.logo) {
    const sizeClasses =
      variant === 'compact'
        ? 'w-14 h-14 rounded-lg p-1.5'
        : variant === 'mobile'
          ? 'w-20 h-20 rounded-xl p-2.5'
          : 'w-28 h-28 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-xl p-4';

    const sizes =
      variant === 'compact'
        ? '56px'
        : variant === 'mobile'
          ? '80px'
          : '(max-width: 1024px) 176px, 192px';

    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-white border border-line flex items-center justify-center ${sizeClasses}`}
      >
        <div className="relative w-full h-full">
          <Image
            src={client.logo}
            alt={`${client.client} logo`}
            fill
            sizes={sizes}
            unoptimized={!isSanityCdnUrl(client.logo)}
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  // Neutral monogram fallback on elevated surface
  const sizeClasses =
    variant === 'compact'
      ? 'w-14 h-14 rounded-lg text-sm'
      : variant === 'mobile'
        ? 'w-20 h-20 rounded-xl text-xl'
        : 'w-28 h-28 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-xl text-3xl sm:text-4xl';

  return (
    <div
      aria-hidden="true"
      className={`shrink-0 bg-elevated border border-line flex items-center justify-center font-display font-bold tracking-tight text-ink select-none ${sizeClasses}`}
    >
      {initials}
    </div>
  );
}
