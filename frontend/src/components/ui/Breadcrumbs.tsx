import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { buildBreadcrumbSchema, serializeJsonLd, type BreadcrumbItem } from '@/lib/seo';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  renderSchema?: boolean;
}

export function Breadcrumbs({
  items,
  className = '',
  renderSchema = true,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <>
      {renderSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(buildBreadcrumbSchema(items)),
          }}
        />
      )}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-mono text-meta ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5 sm:gap-2">
                {idx > 0 && (
                  <ChevronRight
                    size={12}
                    className="text-line-strong shrink-0"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-ink font-semibold truncate max-w-[200px] sm:max-w-[320px]"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
